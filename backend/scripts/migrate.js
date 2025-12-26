// Database migration script for MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Category = require('../models/Category');
const Review = require('../models/Review');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    // Drop existing collections (for fresh migration)
    try {
      await User.collection.drop();
      await Product.collection.drop();
      await Order.collection.drop();
      await CartItem.collection.drop();
      await Category.collection.drop();
      await Review.collection.drop();
      console.log('🧹 Existing collections cleared');
    } catch (err) {
      // Collections don't exist yet, which is fine
      console.log('✅ Starting with fresh collections');
    }
    
    // Ensure indexes are created
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await Category.collection.createIndex({ name: 1 }, { unique: true });
    await CartItem.collection.createIndex({ user_id: 1, product_id: 1 }, { unique: true });
    
    console.log('✅ Indexes created successfully');
    console.log('✅ MongoDB collections ready');
    
    console.log('🎉 Database migration completed successfully!');
    console.log('\n📝 Note: Collections have been initialized and are ready for use.');
    console.log('Run "npm run seed" to populate sample data.\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

migrate();


