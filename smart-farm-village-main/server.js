// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change to your MySQL username
  password: '771088', // Change to your MySQL password
  database: 'smart_farm_village'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Initialize Database Tables
const initDatabase = () => {
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      description TEXT,
      category VARCHAR(100),
      seller_id INT,
      quantity INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      buyer_id INT,
      total_amount DECIMAL(10,2) NOT NULL,
      address TEXT NOT NULL,
      payment_method VARCHAR(100) NOT NULL,
      location VARCHAR(255),
      status VARCHAR(50) DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      product_id INT,
      quantity INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  db.query(createTables, (err) => {
    if (err) {
      console.error('Error creating tables: ' + err);
    } else {
      console.log('Database tables initialized successfully');
    }
  });
};

initDatabase();

// API Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, address, mobile, username, password, userType, gstNumber, panCard, bankAccount, state } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, age, address, mobile, username, password, user_type, gst_number, pan_card, bank_account, state)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [name, age, address, mobile, username, hashedPassword, userType, gstNumber, panCard, bankAccount, state], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        message: 'Registration successful', 
        user: { 
          id: result.insertId, 
          name, 
          username, 
          userType 
        } 
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/login', (req, res) => {
  const { username, password, userType } = req.body;
  
  const query = 'SELECT * FROM users WHERE username = ? AND user_type = ?';
  
  db.query(query, [username, userType], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
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
  });
});

// Products API
app.get('/api/products', (req, res) => {
  const query = `
    SELECT p.*, u.name as seller_name 
    FROM products p 
    LEFT JOIN users u ON p.seller_id = u.id 
    WHERE p.quantity > 0
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, image_url, description, category, seller_id, quantity } = req.body;
  
  const query = `
    INSERT INTO products (name, price, image_url, description, category, seller_id, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [name, price, image_url, description, category, seller_id, quantity], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Product added successfully', productId: result.insertId });
  });
});

// Orders API
app.post('/api/orders', (req, res) => {
  const { buyer_id, products, total_amount, address, payment_method, location } = req.body;
  
  const orderQuery = `
    INSERT INTO orders (buyer_id, total_amount, address, payment_method, location)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(orderQuery, [buyer_id, total_amount, address, payment_method, location], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const orderId = result.insertId;
    
    // Add order items
    const orderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ?
    `;
    
    const orderItems = products.map(item => [
      orderId, 
      item.product.id, 
      item.quantity, 
      item.product.price
    ]);
    
    db.query(orderItemsQuery, [orderItems], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Order created successfully', orderId });
    });
  });
});

app.get('/api/orders/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const query = `
    SELECT o.*, 
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.buyer_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Cart API
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const query = `
    SELECT ci.*, p.name, p.price, p.image_url, p.description, p.category
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  
  // Check if item already exists in cart
  const checkQuery = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
  
  db.query(checkQuery, [user_id, product_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      // Update quantity if item exists
      const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
      db.query(updateQuery, [quantity, user_id, product_id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Cart updated successfully' });
      });
    } else {
      // Add new item to cart
      const insertQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
      db.query(insertQuery, [user_id, product_id, quantity], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Item added to cart successfully' });
      });
    }
  });
});

app.delete('/api/cart/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  const query = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
  
  db.query(query, [userId, productId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Item removed from cart successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});