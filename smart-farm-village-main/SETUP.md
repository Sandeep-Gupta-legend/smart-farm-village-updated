# Smart Farm Village - Complete Setup Guide

This guide will help you set up both the frontend and backend for the Smart Farm Village application.

## 🏗️ Project Structure

```
smart-farm-village-main/
├── backend/                 # Node.js + Express + MySQL API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── setup.js           # Automated setup script
│   ├── scripts/           # Database migration & seeding
│   └── README.md          # Backend documentation
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── services/          # API services
└── package.json           # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd smart-farm-village-main/backend

# Run automated setup (recommended)
npm run setup

# OR manual setup:
# npm install
# cp env.example .env
# # Edit .env with your MySQL credentials
# npm run migrate
# npm run seed
```

### 2. Frontend Setup

```bash
# Navigate to project root
cd smart-farm-village-main

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### 3. Start Backend Server

```bash
# In a new terminal, navigate to backend
cd smart-farm-village-main/backend

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_farm_village
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000`.

## 📊 Database Setup

The backend includes automated database setup:

1. **Migration**: Creates all necessary tables
2. **Seeding**: Populates with sample data

### Sample Data Includes:
- 3 users (2 sellers, 1 buyer)
- 8 sample products
- Product categories
- Sample reviews

### Test Accounts:
- **Seller**: `john_farmer` / `password123`
- **Seller**: `mike_organic` / `password123`
- **Buyer**: `jane_buyer` / `password123`

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🛠️ Available Scripts

### Backend Scripts
```bash
npm run setup      # Automated setup
npm run dev        # Development server
npm start          # Production server
npm run migrate    # Database migration
npm run seed       # Database seeding
npm run reset      # Reset database with fresh data
```

### Frontend Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## 🔍 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller)

### Orders & Cart
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user orders
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:userId/:productId` - Update cart item
- `DELETE /api/cart/:userId/:productId` - Remove from cart

### Categories
- `GET /api/categories` - Get all categories

## 🐛 Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Ensure MySQL is running
   - Check credentials in `.env` file
   - Verify database exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing process using the port

3. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

### Reset Everything

```bash
# Reset backend database
cd backend
npm run reset

# Restart both servers
npm run dev  # Backend
# In another terminal:
cd ../
npm run dev  # Frontend
```

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Frontend Components**: See individual component files
- **Database Schema**: See migration files in `backend/scripts/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check this setup guide
2. Review the README files
3. Open an issue in the repository
4. Contact the development team

---

**Happy Farming! 🌱**


