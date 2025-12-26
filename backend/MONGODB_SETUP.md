# MongoDB Atlas Migration Guide

This backend has been updated to use MongoDB Atlas instead of MySQL. This guide will help you set up and run the application with MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in to your account
3. Create a new project
4. Create a new cluster (free tier is sufficient for development)
5. Create a database user with username and password
6. Add your IP address to the IP Whitelist (or allow access from anywhere: 0.0.0.0/0)
7. Click "Connect" and copy the connection string

Your connection string will look like:
```
mongodb+srv://username:password@cluster-name.mongodb.net/smart_farm_village?retryWrites=true&w=majority
```

## Step 2: Set Up Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/smart_farm_village?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key_here
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

## Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- **mongoose**: MongoDB object modeling
- **express**: Web framework
- **bcryptjs**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- And other dependencies

## Step 4: Initialize Database

### Option A: Run Setup Script (Recommended)
```bash
npm run setup
```

This interactive script will:
- Check Node.js installation
- Install dependencies
- Ask for MongoDB Atlas connection string
- Initialize the database

### Option B: Manual Setup

Run migration to create collections and indexes:
```bash
npm run migrate
```

Seed the database with sample data:
```bash
npm run seed
```

## Step 5: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 5000 (or the port specified in `.env`)

## Database Structure

### Collections

#### Users
- `name`: String (required)
- `username`: String (required, unique)
- `password`: String (required)
- `user_type`: String ('buyer' or 'seller', required)
- `age`: Number
- `address`: String
- `mobile`: String
- `email`: String
- `state`: String
- `gst_number`: String (for sellers)
- `pan_card`: String (for sellers)
- `bank_account`: String (for sellers)
- `is_active`: Boolean (default: true)
- `created_at`: Date
- `updated_at`: Date

#### Products
- `name`: String (required)
- `price`: Number (required)
- `image_url`: String
- `description`: String
- `category`: String
- `seller_id`: ObjectId (references Users)
- `quantity`: Number (required)
- `is_active`: Boolean (default: true)
- `created_at`: Date
- `updated_at`: Date

#### Orders
- `buyer_id`: ObjectId (references Users)
- `total_amount`: Number (required)
- `address`: String (required)
- `payment_method`: String (required)
- `location`: String
- `status`: String ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
- `items`: Array of order items with product_id, quantity, and price
- `created_at`: Date
- `updated_at`: Date

#### CartItems
- `user_id`: ObjectId (references Users)
- `product_id`: ObjectId (references Products)
- `quantity`: Number (required, default: 1)
- `created_at`: Date
- `updated_at`: Date

#### Categories
- `name`: String (required, unique)
- `description`: String
- `created_at`: Date

#### Reviews
- `product_id`: ObjectId (references Products)
- `user_id`: ObjectId (references Users)
- `rating`: Number (1-5)
- `comment`: String
- `created_at`: Date

## Available APIs

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/admin/add` - Add admin
- `POST /api/admin/change-password` - Change admin password

### Products
- `GET /api/products` - Get all products (with pagination, search, category filter)
- `POST /api/products` - Create new product (seller only)
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:userId` - Get user's orders

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:userId/:productId` - Update cart item quantity
- `DELETE /api/cart/:userId/:productId` - Remove item from cart

### Admin
- `GET /api/admin/orders` - Get all orders (admin only)
- `POST /api/admin/order-status` - Update order status (admin only)

### Categories
- `GET /api/categories` - Get all categories

### Health Check
- `GET /api/health` - API health check

## Sample Users (After Seeding)

After running `npm run seed`, you can log in with:

**Sellers:**
- Username: `john_farmer` / Password: `password123`
- Username: `mike_organic` / Password: `password123`

**Buyers:**
- Username: `jane_buyer` / Password: `password123`

## Troubleshooting

### Connection Issues

**Error: "MongoDB connection failed"**
- Check your MONGODB_URI in the `.env` file
- Ensure your IP address is whitelisted in MongoDB Atlas
- Verify username and password are correct

**Error: "Cannot find module 'mongoose'"**
- Run `npm install` to install all dependencies

### Database Issues

**Collections not created:**
```bash
npm run migrate
```

**Need to reset data:**
```bash
npm run reset
```
This will run both migrate and seed scripts.

## Migration from MySQL

The old MySQL version has been backed up to `server-mysql.js`. All the existing functionality has been ported to MongoDB with:

1. **Mongoose schemas** in `/models` directory
2. **MongoDB operations** instead of SQL queries
3. **Proper indexing** for performance
4. **Transaction-like behavior** using sessions for orders

## Key Differences from MySQL

| Feature | MySQL | MongoDB |
|---------|-------|---------|
| ID Type | Integer (Auto-increment) | ObjectId |
| Relationships | Foreign keys | Object references |
| Transactions | Native support | Session-based |
| Constraints | Built-in (CHECK, UNIQUE) | Schema validation |
| Queries | SQL | Mongoose queries |

## Performance Tips

1. **Use indexes** - Key fields are already indexed in schemas
2. **Limit results** - Use pagination for large datasets
3. **Use projections** - Select only needed fields
4. **Cache frequently accessed data** - Categories, popular products

## Security Notes

1. **Never commit .env file** - Use `.gitignore` to exclude it
2. **Rotate JWT secret** - Change the default JWT_SECRET in production
3. **Use environment variables** - Don't hardcode sensitive data
4. **Validate inputs** - Express-validator is configured
5. **Enable CORS carefully** - Currently allows all origins in development

## Next Steps

1. Update the frontend to use the new API endpoints (no changes needed, APIs are compatible)
2. Set up CI/CD pipeline for deployments
3. Configure production MongoDB Atlas cluster
4. Implement JWT authentication middleware
5. Add file upload functionality with multer
6. Set up monitoring and logging

## Support

For MongoDB Atlas support, visit: https://www.mongodb.com/support
For Mongoose documentation, visit: https://mongoosejs.com/docs

## License

MIT
