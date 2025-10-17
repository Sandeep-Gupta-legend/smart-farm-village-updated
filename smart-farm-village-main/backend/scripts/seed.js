// Database seed script
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '771088',
  database: process.env.DB_NAME || 'smart_farm_village'
};

async function seed() {
  let connection;
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MySQL
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    // Clear existing data
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE cart_items');
    await connection.execute('TRUNCATE TABLE order_items');
    await connection.execute('TRUNCATE TABLE orders');
    await connection.execute('TRUNCATE TABLE products');
    await connection.execute('TRUNCATE TABLE users');
    await connection.execute('TRUNCATE TABLE categories');
    await connection.execute('TRUNCATE TABLE reviews');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
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
    
    for (const category of categories) {
      await connection.execute(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
    }
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
    
    for (const user of users) {
      await connection.execute(
        'INSERT INTO users (name, age, address, mobile, username, password, user_type, gst_number, pan_card, bank_account, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.name, user.age, user.address, user.mobile, user.username, user.password, user.user_type, user.gst_number || null, user.pan_card || null, user.bank_account || null, user.state]
      );
    }
    console.log('✅ Users seeded');
    
    // Get user IDs for product creation
    const [userResults] = await connection.execute('SELECT id, user_type FROM users WHERE user_type = "seller"');
    const sellerIds = userResults.map(user => user.id);
    
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
    
    for (const product of products) {
      await connection.execute(
        'INSERT INTO products (name, price, image_url, description, category, seller_id, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.price, product.image_url, product.description, product.category, product.seller_id, product.quantity]
      );
    }
    console.log('✅ Products seeded');
    
    // Insert sample reviews
    const [productResults] = await connection.execute('SELECT id FROM products LIMIT 3');
    const [buyerResults] = await connection.execute('SELECT id FROM users WHERE user_type = "buyer"');
    
    if (productResults.length > 0 && buyerResults.length > 0) {
      const reviews = [
        {
          product_id: productResults[0].id,
          user_id: buyerResults[0].id,
          rating: 5,
          comment: 'Excellent quality tomatoes! Very fresh and tasty.'
        },
        {
          product_id: productResults[1].id,
          user_id: buyerResults[0].id,
          rating: 4,
          comment: 'Good spinach, delivered fresh. Will order again.'
        },
        {
          product_id: productResults[2].id,
          user_id: buyerResults[0].id,
          rating: 5,
          comment: 'Amazing mangoes! Sweet and perfectly ripe.'
        }
      ];
      
      for (const review of reviews) {
        await connection.execute(
          'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
          [review.product_id, review.user_id, review.rating, review.comment]
        );
      }
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
    if (connection) {
      await connection.end();
    }
  }
}

seed();


