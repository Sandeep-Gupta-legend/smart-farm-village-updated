// Database seed script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    console.log('🧹 Cleared existing data');
    
    // Insert categories
    const categories = [
      { name: 'Vegetables', description: 'Fresh vegetables from local farms' },
      { name: 'Fruits', description: 'Seasonal fruits and berries' },
      { name: 'Grains', description: 'Rice, wheat, and other grains' },
      { name: 'Spices', description: 'Herbs and spices' },
      { name: 'Dairy', description: 'Milk, cheese, and dairy products' },
      { name: 'Seeds', description: 'Plant seeds and seedlings' },
      { name: 'Fertilizers', description: 'Organic and chemical fertilizers' },
      { name: 'Tools', description: 'Farming tools and equipment' }
    ];
    
    await Category.insertMany(categories);
    console.log('✅ Categories seeded');
    
    // Insert sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'John Farmer',
        age: 35,
        address: '123 Farm Road, Agricultural District',
        mobile: '9876543210',
        username: 'john_farmer',
        password: hashedPassword,
        user_type: 'seller',
        gst_number: 'GST123456789',
        pan_card: 'ABCDE1234F',
        bank_account: '1234567890123456',
        state: 'Maharashtra'
      },
      {
        name: 'Jane Buyer',
        age: 28,
        address: '456 Market Street, City Center',
        mobile: '9876543211',
        username: 'jane_buyer',
        password: hashedPassword,
        user_type: 'buyer',
        state: 'Maharashtra'
      },
      {
        name: 'Mike Organic',
        age: 42,
        address: '789 Organic Lane, Green Valley',
        mobile: '9876543212',
        username: 'mike_organic',
        password: hashedPassword,
        user_type: 'seller',
        gst_number: 'GST987654321',
        pan_card: 'FGHIJ5678K',
        bank_account: '9876543210987654',
        state: 'Karnataka'
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log('✅ Users seeded');
    
    const sellerIds = createdUsers.filter(u => u.user_type === 'seller').map(u => u._id);
    const buyerIds = createdUsers.filter(u => u.user_type === 'buyer').map(u => u._id);
    
    // Insert sample products
    const products = [
      {
        name: 'Fresh Tomatoes',
        price: 45.00,
        image_url: '/images/tomatoes.jpg',
        description: 'Fresh, organic tomatoes from our farm. Perfect for cooking and salads.',
        category: 'Vegetables',
        seller_id: sellerIds[0],
        quantity: 100
      },
      {
        name: 'Organic Spinach',
        price: 25.00,
        image_url: '/images/spinach.jpg',
        description: 'Fresh organic spinach leaves, rich in iron and vitamins.',
        category: 'Vegetables',
        seller_id: sellerIds[0],
        quantity: 50
      },
      {
        name: 'Mangoes (Alphonso)',
        price: 120.00,
        image_url: '/images/mangoes.jpg',
        description: 'Premium Alphonso mangoes, sweet and juicy.',
        category: 'Fruits',
        seller_id: sellerIds[0],
        quantity: 30
      },
      {
        name: 'Basmati Rice',
        price: 85.00,
        image_url: '/images/rice.jpg',
        description: 'Premium quality basmati rice, long grain and aromatic.',
        category: 'Grains',
        seller_id: sellerIds[1],
        quantity: 200
      },
      {
        name: 'Turmeric Powder',
        price: 35.00,
        image_url: '/images/turmeric.jpg',
        description: 'Pure turmeric powder, great for cooking and health benefits.',
        category: 'Spices',
        seller_id: sellerIds[1],
        quantity: 75
      },
      {
        name: 'Organic Fertilizer',
        price: 150.00,
        image_url: '/images/fertilizer.jpg',
        description: 'Natural organic fertilizer for healthy plant growth.',
        category: 'Fertilizers',
        seller_id: sellerIds[1],
        quantity: 40
      },
      {
        name: 'Garden Spade',
        price: 250.00,
        image_url: '/images/spade.jpg',
        description: 'Heavy-duty garden spade for digging and planting.',
        category: 'Tools',
        seller_id: sellerIds[1],
        quantity: 15
      },
      {
        name: 'Fresh Milk',
        price: 60.00,
        image_url: '/images/milk.jpg',
        description: 'Fresh cow milk, delivered daily from our dairy farm.',
        category: 'Dairy',
        seller_id: sellerIds[0],
        quantity: 80
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log('✅ Products seeded');
    
    // Insert sample reviews
    if (createdProducts.length >= 3 && buyerIds.length > 0) {
      const reviews = [
        {
          product_id: createdProducts[0]._id,
          user_id: buyerIds[0],
          rating: 5,
          comment: 'Excellent quality tomatoes! Very fresh and tasty.'
        },
        {
          product_id: createdProducts[1]._id,
          user_id: buyerIds[0],
          rating: 4,
          comment: 'Good spinach, delivered fresh. Will order again.'
        },
        {
          product_id: createdProducts[2]._id,
          user_id: buyerIds[0],
          rating: 5,
          comment: 'Amazing mangoes! Sweet and perfectly ripe.'
        }
      ];
      
      await Review.insertMany(reviews);
      console.log('✅ Reviews seeded');
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('👨‍🌾 Seller: john_farmer / password123');
    console.log('👨‍🌾 Seller: mike_organic / password123');
    console.log('🛒 Buyer: jane_buyer / password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seed();


