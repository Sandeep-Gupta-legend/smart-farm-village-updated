// server.js
process.on('uncaughtException', err => { console.error('Uncaught Exception:', err); });
process.on('unhandledRejection', err => { console.error('Unhandled Rejection:', err); });
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MySQL Database Connection Pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '771088',
  database: process.env.DB_NAME || 'smart_farm_village',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

testConnection();

// Initialize Database Tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create tables one by one
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT,
        address TEXT,
        mobile VARCHAR(20),
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('buyer', 'seller') NOT NULL,
        gst_number VARCHAR(100),
        pan_card VARCHAR(100),
        bank_account VARCHAR(100),
        state VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        description TEXT,
        category VARCHAR(100),
        seller_id INT,
        quantity INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buyer_id INT,
        total_amount DECIMAL(10,2) NOT NULL,
        address TEXT NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_item (user_id, product_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        user_id INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    ];

    // Execute each table creation separately
    for (const tableQuery of tables) {
      await connection.execute(tableQuery);
    }
    
    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  }
};

// Initialize database on startup
initDatabase();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};


// Ensure JSON body parsing
app.use(express.json());
// API Routes

// Gemini AI Proxy Route
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.post('/api/gemini', async (req, res) => {
  const { query } = req.body;
  const GEMINI_API_KEY = 'AIzaSyDFjuv6IMNmopHEBNJzlJQCHZV5xJ1x_0Q';
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(500).json({ answer: 'Error from Gemini API', error: errorText });
    }
    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer found.';
    res.json({ answer });
  } catch (err) {
    console.error('Gemini API connection error:', err);
    res.status(500).json({ answer: 'Error connecting to Gemini AI.', error: err.message });
  }
});
// --- Admin Panel APIs ---
// Get all orders (for delivery status management)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT id, buyer_id, status FROM orders ORDER BY id DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order delivery status
app.post('/api/admin/order-status', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Add new admin (dummy email verification)
app.post('/api/admin/add', async (req, res) => {
  const { email } = req.body;
  // TODO: Send verification email here
  res.json({ message: `Verification email sent to ${email}` });
});

// Change admin password (dummy logic)
app.post('/api/admin/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // TODO: Implement real password change logic
  if (currentPassword === 'sandeep123') {
    // Simulate password change
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(400).json({ error: 'Current password incorrect' });
  }
});
// Explicit OPTIONS route for CORS preflight
app.options('/api/register', cors());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, age, address, mobile, username, password, userType, 
      gstNumber, panCard, bankAccount, state 
    } = req.body;
    
    // Validation
    if (!name || !username || !password || !userType) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (name, age, address, mobile, username, password, user_type, gst_number, pan_card, bank_account, state)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      name, 
      age || null, 
      address || null, 
      mobile || null, 
      username, 
      hashedPassword, 
      userType, 
      gstNumber || null, 
      panCard || null, 
      bankAccount || null, 
      state || null
    ]);
    
    res.status(201).json({ 
      message: 'Registration successful', 
      user: { 
        id: result.insertId, 
        name, 
        username, 
        userType 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ 
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    
    if (!username || !password || !userType) {
      return res.status(400).json({ error: 'Username, password, and user type are required' });
    }
    
    const query = 'SELECT * FROM users WHERE username = ? AND user_type = ? AND is_active = TRUE';
    const [results] = await pool.execute(query, [username, userType]);
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, u.name as seller_name, u.state as seller_state
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      WHERE p.quantity > 0 AND p.is_active = TRUE
    `;
    
    const params = [];
    
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [products] = await pool.execute(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.quantity > 0 AND p.is_active = TRUE';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND p.category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image_url, description, category, seller_id, quantity } = req.body;
    
    if (!name || !price || !seller_id || quantity === undefined) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    const query = `
      INSERT INTO products (name, price, image_url, description, category, seller_id, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      name, price, image_url, description, category, seller_id, quantity
    ]);
    
    res.status(201).json({ 
      message: 'Product added successfully', 
      productId: result.insertId 
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT p.*, u.name as seller_name, u.state as seller_state
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      WHERE p.id = ? AND p.is_active = TRUE
    `;
    
    const [results] = await pool.execute(query, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const { buyer_id, products, total_amount, address, payment_method, location } = req.body;
    
    if (!buyer_id || !products || !total_amount || !address || !payment_method) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create order
      const orderQuery = `
        INSERT INTO orders (buyer_id, total_amount, address, payment_method, location)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [orderResult] = await connection.execute(orderQuery, [
        buyer_id, total_amount, address, payment_method, location
      ]);
      
      const orderId = orderResult.insertId;
      
      // Add order items
      const orderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `;
      
      for (const item of products) {
        await connection.execute(orderItemsQuery, [
          orderId, item.product.id, item.quantity, item.product.price
        ]);
        
        // Update product quantity
        await connection.execute(
          'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }
      
      await connection.commit();
      res.status(201).json({ 
        message: 'Order created successfully', 
        orderId 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const query = `
      SELECT o.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', p.name
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.buyer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    const [results] = await pool.execute(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Cart API
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const query = `
      SELECT ci.*, p.name, p.price, p.image_url, p.description, p.category, p.quantity as available_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = TRUE
    `;
    
    const [results] = await pool.execute(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;
    
    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }
    
    // Check if product exists and is available
    const [productCheck] = await pool.execute(
      'SELECT quantity FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );
    
    if (productCheck.length === 0) {
      return res.status(404).json({ error: 'Product not found or not available' });
    }
    
    if (productCheck[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }
    
    // Check if item already exists in cart
    const [existingItem] = await pool.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    
    if (existingItem.length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id]
      );
      res.json({ message: 'Cart updated successfully' });
    } else {
      // Add new item to cart
      await pool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
      res.json({ message: 'Item added to cart successfully' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.put('/api/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/api/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(results);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

