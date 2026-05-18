# Smart Farm Village - Backend API

A robust Node.js backend API for the Smart Farm Village marketplace application, built with Express.js and MySQL.

## 🚀 Features

- **User Management**: Registration and authentication for buyers and sellers
- **Product Management**: CRUD operations for agricultural products
- **Order System**: Complete order processing with order items
- **Shopping Cart**: Add, update, and remove items from cart
- **Categories**: Product categorization system
- **Reviews**: Product rating and review system
- **Security**: Password hashing, rate limiting, CORS protection
- **Database**: MySQL with connection pooling and migrations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd smart-farm-village-main/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=smart_farm_village
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up MySQL database:**
   - Create a MySQL database named `smart_farm_village`
   - Make sure MySQL server is running

5. **Run database migrations:**
   ```bash
   npm run migrate
   ```

6. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products (with pagination, search, category filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (seller only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:userId` - Get user's orders

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:userId/:productId` - Update cart item quantity
- `DELETE /api/cart/:userId/:productId` - Remove item from cart

### Categories
- `GET /api/categories` - Get all categories

## 🗄️ Database Schema

### Users Table
- User information for both buyers and sellers
- Includes authentication and profile data

### Products Table
- Product information with seller relationship
- Includes pricing, description, and inventory

### Orders Table
- Order information with buyer relationship
- Tracks order status and payment details

### Order Items Table
- Individual items within each order
- Links products to orders with quantities

### Cart Items Table
- Shopping cart functionality
- Temporary storage for user's selected items

### Categories Table
- Product categorization system
- Hierarchical category structure

### Reviews Table
- Product reviews and ratings
- User feedback system

## 🔧 Configuration

### Environment Variables
- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: smart_farm_village)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

### Security Features
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 📝 Sample Data

After running the seed script, you'll have:
- 3 sample users (2 sellers, 1 buyer)
- 8 sample products across different categories
- Sample reviews and categories

**Test Accounts:**
- Seller: `john_farmer` / `password123`
- Seller: `mike_organic` / `password123`
- Buyer: `jane_buyer` / `password123`

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📦 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🔍 API Documentation

### Request/Response Examples

#### User Registration
```bash
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "age": 30,
  "address": "123 Farm Road",
  "mobile": "9876543210",
  "username": "john_doe",
  "password": "password123",
  "userType": "seller",
  "gstNumber": "GST123456789",
  "panCard": "ABCDE1234F",
  "bankAccount": "1234567890123456",
  "state": "Maharashtra"
}
```

#### Product Creation
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "price": 45.00,
  "image_url": "/images/tomatoes.jpg",
  "description": "Fresh, organic tomatoes",
  "category": "Vegetables",
  "seller_id": 1,
  "quantity": 100
}
```

#### Add to Cart
```bash
POST /api/cart
Content-Type: application/json

{
  "user_id": 1,
  "product_id": 1,
  "quantity": 2
}
```

## 🚨 Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "message": "Detailed error description (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Database Migrations

The migration script creates all necessary tables with proper relationships and constraints. Run it before starting the application:

```bash
npm run migrate
```

## 🌱 Seeding

The seed script populates the database with sample data for testing and development:

```bash
npm run seed
```

## 📈 Performance

- Connection pooling for MySQL
- Compression middleware
- Rate limiting
- Efficient queries with proper indexing

## 🔒 Security

- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- CORS configuration
- Rate limiting
- Security headers with Helmet.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.



