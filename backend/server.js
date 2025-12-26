// server.js
process.on('uncaughtException', err => { console.error('Uncaught Exception:', err); });
process.on('unhandledRejection', err => { console.error('Unhandled Rejection:', err); });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Import database connection
const connectDB = require('./db');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const CartItem = require('./models/CartItem');
const Category = require('./models/Category');
const Review = require('./models/Review');

// Import authentication middleware
const { verifyToken, isSeller, isBuyer, isAdmin, ownsResource, generateToken } = require('./middleware/authMiddleware');

// Import Cloudinary utilities
const { uploadToCloudinary, uploadImageUrl, deleteImage } = require('./utils/cloudinaryUpload');
const app = express();
const PORT = process.env.PORT || 5000;
// Login security settings
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5; // attempts before lock
const LOCK_TIME = parseInt(process.env.LOCK_TIME_MS, 10) || 30 * 60 * 1000; // 30 minutes

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

// Stricter limiter for authentication endpoints to slow down brute force
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 6, // limit each IP to 6 login attempts per minute
  message: 'Too many login attempts from this IP, please try again later.'
});

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
app.use(express.json());

// Connect to MongoDB
connectDB();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// API Routes

// Fallback agricultural knowledge base for Gemini AI
const fallbackAnswers = {
  tomato: "To grow tomatoes: 1) Plant in well-draining soil with full sunlight (6-8 hours daily). 2) Water regularly, keeping soil moist but not waterlogged. 3) Support with stakes or cages as they grow. 4) Fertilize every 2-3 weeks with balanced fertilizer. 5) Harvest when fully colored and slightly soft to touch.",
  potato: "Growing potatoes: 1) Use seed potatoes with 'eyes' (buds). 2) Plant 4 inches deep in loose, well-draining soil. 3) Hill soil around plants as they grow to prevent greening. 4) Water consistently, especially during tuber formation. 5) Harvest 70-90 days after planting when foliage dies back.",
  corn: "Growing corn: 1) Plant seeds 1.5 inches deep in warm soil. 2) Space rows 30 inches apart. 3) Thin seedlings to 8-12 inches apart. 4) Water 1 inch per week. 5) Fertilize at knee height and tasseling stage. 6) Harvest when kernels are full and milky.",
  wheat: "Growing wheat: 1) Plant in fall or spring depending on variety. 2) Requires well-prepared seedbed. 3) Water regularly during growing season. 4) Fertilize with nitrogen at growth stages. 5) Harvest when grain is hard and moisture content is 12-14%.",
  rice: "Growing rice: 1) Requires flooded fields (paddies). 2) Plant in rows with water depth of 5-10 cm. 3) Maintain water level throughout growing season. 4) Apply fertilizer in 2-3 splits. 5) Drain field before harvest.",
  disease: "For crop diseases: 1) Identify the specific disease with symptoms. 2) Use disease-resistant varieties when available. 3) Practice crop rotation. 4) Apply appropriate fungicides/pesticides if needed. 5) Remove infected plants. Consult local agricultural extension for specific treatment.",
  pest: "For pest management: 1) Monitor crops regularly for signs of pests. 2) Use integrated pest management (IPM) approach. 3) Encourage natural predators. 4) Use organic or chemical pesticides as appropriate. 5) Rotate crops and use resistant varieties.",
  fertilizer: "Fertilizer guidance: 1) NPK ratio (Nitrogen-Phosphorus-Potassium) varies by crop. 2) Most vegetables need balanced 10-10-10 or 12-12-12. 3) Apply as per soil test recommendations. 4) Split applications throughout growing season. 5) Organic options: compost, manure, bone meal.",
  soil: "Improving soil: 1) Test soil pH and nutrient content. 2) Add organic matter (compost, manure) regularly. 3) Use mulch to retain moisture and suppress weeds. 4) Practice crop rotation. 5) Avoid compaction by minimizing traffic.",
  water: "Irrigation tips: 1) Water early morning to reduce disease. 2) Most vegetables need 1-2 inches per week. 3) Deep watering is better than frequent shallow watering. 4) Use drip irrigation for efficiency. 5) Avoid wetting foliage to prevent fungal diseases."
};

// Helper function to find fallback answer based on query keywords
const findFallbackAnswer = (query) => {
  const lowerQuery = query.toLowerCase();
  for (const [keyword, answer] of Object.entries(fallbackAnswers)) {
    if (lowerQuery.includes(keyword)) {
      return answer;
    }
  }
  return null;
};

// Gemini AI Proxy Route
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.post('/api/gemini', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Validation
    if (!query) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Query is required' 
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not configured');
      return res.status(500).json({ 
        error: 'Configuration Error',
        message: 'Gemini API key is not configured. Please add GEMINI_API_KEY to .env' 
      });
    }

    console.log('Calling Gemini API with query:', query);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: query }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 1024
            }
          })
        }
      );

      console.log('Gemini API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Gemini API response:', JSON.stringify(data, null, 2));
        
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (answer) {
          return res.json({ 
            success: true,
            answer,
            source: 'gemini'
          });
        }
      } else {
        const errorText = await response.text();
        console.error('Gemini API error response:', response.status, errorText);
      }
    } catch (apiErr) {
      console.error('Gemini API call failed:', apiErr.message);
    }

    // Fallback: Try to find answer from knowledge base
    const fallbackAnswer = findFallbackAnswer(query);
    if (fallbackAnswer) {
      console.log('Using fallback answer for query:', query);
      return res.json({
        success: true,
        answer: fallbackAnswer,
        source: 'fallback'
      });
    }

    // If all else fails, return a helpful default
    return res.json({
      success: true,
      answer: 'For agricultural advice, try asking about: tomato, potato, corn, wheat, rice, crop diseases, pest management, fertilizer, soil improvement, or irrigation. Our system has built-in knowledge for these topics.',
      source: 'default'
    });

  } catch (err) {
    console.error('Gemini AI endpoint error:', err);
    
    // Even on error, try fallback
    const fallbackAnswer = findFallbackAnswer(req.body.query || '');
    if (fallbackAnswer) {
      return res.json({
        success: true,
        answer: fallbackAnswer,
        source: 'fallback_error'
      });
    }
    
    res.status(500).json({ 
      error: 'Connection Error',
      message: 'Failed to connect to Gemini AI service. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// --- Admin Panel APIs ---
// Get all orders (Protected - Admin Only)
app.get('/api/admin/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}, 'id buyer_id status').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order delivery status (Protected - Admin Only)
app.post('/api/admin/order-status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Validation
    if (!orderId) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Order ID is required' 
      });
    }

    if (!status) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Status is required' 
      });
    }

    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ 
        error: 'Order Not Found',
        message: 'Order with the specified ID does not exist' 
      });
    }

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
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
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Name, username, password, and user type are required' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Username must be at least 3 characters long' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long' 
      });
    }

    if (!['buyer', 'seller'].includes(userType)) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'User type must be either "buyer" or "seller"' 
      });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User Already Exists',
        message: `Username "${username}" is already taken. Please try a different username or login if you already have an account.` 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = new User({
      name: name.trim(),
      age: age || null,
      address: address ? address.trim() : null,
      mobile: mobile ? mobile.trim() : null,
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      user_type: userType,
      gst_number: gstNumber ? gstNumber.trim() : null,
      pan_card: panCard ? panCard.trim() : null,
      bank_account: bankAccount ? bankAccount.trim() : null,
      state: state ? state.trim() : null
    });
    
    const savedUser = await newUser.save();
    
    // Generate JWT token
    const token = generateToken(savedUser);
    
    res.status(201).json({ 
      message: 'Registration successful. You are now logged in.',
      token,
      user: { 
        id: savedUser._id, 
        name: savedUser.name, 
        username: savedUser.username, 
        userType: savedUser.user_type 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration Failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong. Please try again.'
    });
  }
});

// User Login
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    
    // Validation
    if (!username || !password || !userType) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Username, password, and user type are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({
      username: username.toLowerCase(),
      user_type: userType,
      is_active: true
    });

    if (!user) {
      console.warn(`Login failed: user not found - username=${username} userType=${userType} ip=${req.ip}`);
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Username or password is incorrect. Please try again.'
      });
    }

    // Check for account lock
    if (user.lock_until && user.lock_until > Date.now()) {
      const remaining = Math.ceil((user.lock_until - Date.now()) / 60000);
      return res.status(423).json({
        error: 'Account Locked',
        message: `Account temporarily locked due to multiple failed login attempts. Try again in ${remaining} minute(s).`
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.warn(`Login failed: invalid password - username=${username} ip=${req.ip}`);
      // Increment login attempts
      user.login_attempts = (user.login_attempts || 0) + 1;

      // Lock account if max attempts exceeded
      if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {
        user.lock_until = new Date(Date.now() + LOCK_TIME);
      }

      await user.save();

      const attemptsLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - user.login_attempts);
      const message = user.lock_until && user.lock_until > Date.now()
        ? 'Account locked due to multiple failed attempts.'
        : `Invalid credentials. ${attemptsLeft} attempt(s) remaining.`;

      return res.status(401).json({
        error: 'Invalid Credentials',
        message
      });
    }

    // Successful login: reset attempts and lock
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login Failed',
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Get User Profile (Protected Route)
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User Not Found',
        message: 'Your user account no longer exists.' 
      });
    }
    
    res.json({
      message: 'Profile retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        age: user.age,
        address: user.address,
        mobile: user.mobile,
        state: user.state,
        user_type: user.user_type,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Update User Profile (Protected Route)
app.put('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const { name, age, address, mobile, state } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name || undefined,
        age: age || undefined,
        address: address || undefined,
        mobile: mobile || undefined,
        state: state || undefined
      },
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        age: user.age,
        address: user.address,
        mobile: user.mobile,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Logout (Clear token on client side)
app.post('/api/logout', verifyToken, (req, res) => {
  res.json({ 
    message: 'Logout successful. Please clear your token on the client side.' 
  });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { quantity: { $gt: 0 }, is_active: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .populate('seller_id', 'name state')
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        description: p.description,
        category: p.category,
        seller_id: p.seller_id._id,
        seller_name: p.seller_id.name,
        seller_state: p.seller_id.state,
        quantity: p.quantity,
        is_active: p.is_active,
        created_at: p.created_at
      })),
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

// Create Product (Protected - Sellers Only)
app.post('/api/products', verifyToken, isSeller, async (req, res) => {
  try {
    const { name, price, image_url, description, category, quantity } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Product name is required' 
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Product price is required' 
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Product quantity is required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Price must be a positive number' 
      });
    }

    if (quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Quantity must be a positive integer' 
      });
    }

    // Handle image upload to Cloudinary if provided
    let finalImageUrl = image_url || null;
    
    if (image_url && typeof image_url === 'string' && image_url.startsWith('http')) {
      // Upload image URL to Cloudinary
      try {
        const uploadResult = await uploadImageUrl(image_url, 'smart-farm-village/products');
        finalImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.warn('Cloudinary upload warning:', uploadError.message);
        // Continue with original URL if Cloudinary fails
        finalImageUrl = image_url;
      }
    }
    
    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      price: parseFloat(price),
      image_url: finalImageUrl,
      description: description ? description.trim() : null,
      category: category ? category.trim() : null,
      seller_id: req.userId,
      quantity: parseInt(quantity),
      is_active: true
    });
    
    const savedProduct = await newProduct.save();
    
    res.status(201).json({ 
      message: 'Product added successfully', 
      productId: savedProduct._id,
      product: {
        id: savedProduct._id,
        name: savedProduct.name,
        price: savedProduct.price,
        image_url: savedProduct.image_url,
        description: savedProduct.description,
        category: savedProduct.category,
        quantity: savedProduct.quantity,
        seller_id: savedProduct.seller_id
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      error: 'Failed to add product',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong' 
    });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, is_active: true })
      .populate('seller_id', 'name state');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      id: product._id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      category: product.category,
      seller_id: product.seller_id._id,
      seller_name: product.seller_id.name,
      seller_state: product.seller_id.state,
      quantity: product.quantity,
      is_active: product.is_active,
      created_at: product.created_at
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Orders API - Create Order (Protected - Buyers Only)
app.post('/api/orders', verifyToken, isBuyer, async (req, res) => {
  try {
    const { products, total_amount, address, payment_method, location } = req.body;
    const buyer_id = req.userId; // Get buyer ID from JWT token
    
    // Validation
    if (!products || !total_amount || !address || !payment_method) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Products, total amount, address, and payment method are required' 
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'At least one product must be in the order' 
      });
    }

    if (total_amount <= 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Total amount must be greater than 0' 
      });
    }

    if (address.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Address cannot be empty' 
      });
    }
    
    // Start a session for transaction-like behavior
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Prepare order items and update product quantities
      const orderItems = [];
      
      for (const item of products) {
        const product = await Product.findById(item.product.id).session(session);
        
        if (!product) {
          throw new Error(`Product ${item.product.id} not found`);
        }
        
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for product ${product.name}`);
        }
        
        // Update product quantity
        await Product.findByIdAndUpdate(
          item.product.id,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
        
        orderItems.push({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        });
      }
      
      // Create order with items embedded
      const newOrder = new Order({
        buyer_id,
        total_amount,
        address,
        payment_method,
        location,
        items: orderItems
      });
      
      const savedOrder = await newOrder.save({ session });
      
      await session.commitTransaction();
      
      res.status(201).json({ 
        message: 'Order created successfully', 
        orderId: savedOrder._id 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

// Get Orders (Protected - Verified User)
app.get('/api/orders/:userId', verifyToken, ownsResource('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Additional verification that user owns these orders
    const orders = await Order.find({ buyer_id: userId })
      .populate('items.product_id', 'name')
      .sort({ created_at: -1 });
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      buyer_id: order.buyer_id,
      total_amount: order.total_amount,
      address: order.address,
      payment_method: order.payment_method,
      location: order.location,
      status: order.status,
      created_at: order.created_at,
      items: order.items.map(item => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.product_id.name
      }))
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Cart API - Get Cart (Protected)
app.get('/api/cart/:userId', verifyToken, ownsResource('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cartItems = await CartItem.find({ user_id: userId })
      .populate('product_id');
    
    const formattedCart = cartItems
      .filter(item => item.product_id && item.product_id.is_active)
      .map(item => ({
        id: item._id,
        user_id: item.user_id,
        product_id: item.product_id._id,
        quantity: item.quantity,
        name: item.product_id.name,
        price: item.product_id.price,
        image_url: item.product_id.image_url,
        description: item.product_id.description,
        category: item.product_id.category,
        available_quantity: item.product_id.quantity
      }));
    
    res.json(formattedCart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to Cart (Protected - Buyers)
app.post('/api/cart', verifyToken, isBuyer, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.userId; // Get user ID from JWT token
    
    // Validation
    if (!product_id) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Product ID is required' 
      });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Quantity must be a positive integer' 
      });
    }
    
    // Check if product exists and is available
    const product = await Product.findOne({ _id: product_id, is_active: true });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product Not Found',
        message: 'Product not found or not available' 
      });
    }
    
    if (product.quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient Quantity',
        message: `Only ${product.quantity} items available` 
      });
    }
    
    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({ user_id, product_id });
    
    if (cartItem) {
      // Update quantity
      if (cartItem.quantity + quantity > product.quantity) {
        return res.status(400).json({ 
          error: 'Insufficient Quantity',
          message: `Only ${product.quantity} items available for this product` 
        });
      }
      cartItem.quantity += quantity;
      await cartItem.save();
      res.json({ message: 'Cart updated successfully' });
    } else {
      // Add new item to cart
      const newCartItem = new CartItem({
        user_id,
        product_id,
        quantity
      });
      await newCartItem.save();
      res.json({ message: 'Item added to cart successfully' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update Cart Item (Protected)
app.put('/api/cart/:userId/:productId', verifyToken, ownsResource('userId'), async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    // Validation
    if (quantity === undefined) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Quantity is required' 
      });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Quantity must be a positive integer' 
      });
    }
    
    // Check if product exists and has enough quantity
    const product = await Product.findOne({ _id: productId, is_active: true });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product Not Found',
        message: 'Product not found or not available' 
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient Quantity',
        message: `Only ${product.quantity} items available` 
      });
    }
    
    const cartItem = await CartItem.findOneAndUpdate(
      { user_id: userId, product_id: productId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ 
        error: 'Cart Item Not Found',
        message: 'Item not found in cart' 
      });
    }
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Delete from Cart (Protected)
app.delete('/api/cart/:userId/:productId', verifyToken, ownsResource('userId'), async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const cartItem = await CartItem.findOneAndDelete({ 
      user_id: userId, 
      product_id: productId 
    });

    if (!cartItem) {
      return res.status(404).json({ 
        error: 'Cart Item Not Found',
        message: 'Item not found in cart' 
      });
    }
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
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
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
