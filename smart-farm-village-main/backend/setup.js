#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 Smart Farm Village Backend Setup');
  console.log('=====================================\n');

  try {
    // Check if Node.js is installed
    console.log('📋 Checking prerequisites...');
    try {
      execSync('node --version', { stdio: 'pipe' });
      console.log('✅ Node.js is installed');
    } catch (error) {
      console.error('❌ Node.js is not installed. Please install Node.js first.');
      process.exit(1);
    }

    // Check if MySQL is available
    try {
      execSync('mysql --version', { stdio: 'pipe' });
      console.log('✅ MySQL is available');
    } catch (error) {
      console.warn('⚠️  MySQL command not found. Please ensure MySQL is installed and running.');
    }

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');

    // Create .env file if it doesn't exist
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      console.log('\n⚙️  Setting up environment configuration...');
      
      const dbHost = await question('Database host (localhost): ') || 'localhost';
      const dbUser = await question('Database username (root): ') || 'root';
      const dbPassword = await question('Database password: ');
      const dbName = await question('Database name (smart_farm_village): ') || 'smart_farm_village';
      const port = await question('Server port (5000): ') || '5000';
      const frontendUrl = await question('Frontend URL (http://localhost:3000): ') || 'http://localhost:3000';

      const envContent = `# Database Configuration
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# Server Configuration
PORT=${port}
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=${frontendUrl}

# JWT Secret (if using JWT authentication)
JWT_SECRET=your_jwt_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads`;

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment file created');
    } else {
      console.log('✅ Environment file already exists');
    }

    // Run database migration
    console.log('\n🗄️  Setting up database...');
    try {
      execSync('node scripts/migrate.js', { stdio: 'inherit' });
      console.log('✅ Database migration completed');
    } catch (error) {
      console.error('❌ Database migration failed. Please check your MySQL connection.');
      console.error('Make sure MySQL is running and the database credentials are correct.');
      process.exit(1);
    }

    // Ask if user wants to seed the database
    const seedDatabase = await question('\n🌱 Do you want to seed the database with sample data? (y/N): ');
    if (seedDatabase.toLowerCase() === 'y' || seedDatabase.toLowerCase() === 'yes') {
      try {
        execSync('node scripts/seed.js', { stdio: 'inherit' });
        console.log('✅ Database seeded with sample data');
      } catch (error) {
        console.error('❌ Database seeding failed:', error.message);
      }
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. The API will be available at: http://localhost:' + (process.env.PORT || '5000'));
    console.log('3. Health check endpoint: http://localhost:' + (process.env.PORT || '5000') + '/api/health');
    
    if (seedDatabase.toLowerCase() === 'y' || seedDatabase.toLowerCase() === 'yes') {
      console.log('\n🔑 Sample accounts created:');
      console.log('   Seller: john_farmer / password123');
      console.log('   Seller: mike_organic / password123');
      console.log('   Buyer: jane_buyer / password123');
    }

    console.log('\n📚 For more information, check the README.md file');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();