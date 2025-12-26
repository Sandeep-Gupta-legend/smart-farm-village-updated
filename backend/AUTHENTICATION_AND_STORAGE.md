# Authentication & Image Storage Implementation Guide

## 🔐 Authentication System

Your Smart Farm Village backend now has a complete JWT-based authentication system with role-based access control (RBAC).

### Authentication Features

#### 1. **User Registration (`POST /api/register`)**
- ✅ Prevents duplicate usernames (409 Conflict response)
- ✅ Validates username length (minimum 3 characters)
- ✅ Validates password length (minimum 6 characters)
- ✅ Validates userType (only "buyer" or "seller" allowed)
- ✅ Auto-generates JWT token upon successful registration
- ✅ Hashes passwords using bcryptjs

**Request Example:**
```json
{
  "username": "john_farmer",
  "email": "john@example.com",
  "password": "secure_password_123",
  "userType": "seller"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "userType": "seller"
}
```

#### 2. **User Login (`POST /api/login`)**
- ✅ Validates username and password
- ✅ Generates JWT token valid for 7 days
- ✅ Returns user info and token

**Request Example:**
```json
{
  "username": "john_farmer",
  "password": "secure_password_123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "userType": "seller"
}
```

#### 3. **Protected User Profile Routes**

##### Get Profile (`GET /api/users/profile`)
- Requires valid JWT token
- Returns authenticated user's profile data

##### Update Profile (`PUT /api/users/profile`)
- Requires valid JWT token
- Updates user profile information

##### Logout (`POST /api/logout`)
- Requires valid JWT token
- Client should discard the token after this call

### Role-Based Access Control (RBAC)

Three user roles are defined:

#### **Buyer Role**
Protected endpoints:
- `POST /api/orders` - Create orders
- `GET /api/cart/:userId` - View cart
- `POST /api/cart` - Add items to cart
- `PUT /api/cart/:userId/:productId` - Update cart items
- `DELETE /api/cart/:userId/:productId` - Remove items from cart

#### **Seller Role**
Protected endpoints:
- `POST /api/products` - Create/list products
- `GET /api/products` - View own products
- `GET /api/orders/:userId` - View orders for products

#### **Admin Role**
Protected endpoints:
- `GET /api/admin/orders` - View all orders
- `POST /api/admin/order-status` - Update order delivery status

### JWT Token Structure

The JWT token includes the following payload:
```javascript
{
  id: "user_mongodb_id",
  username: "john_farmer",
  user_type: "seller",
  email: "john@example.com",
  iat: 1640000000,
  exp: 1640604800  // Expires in 7 days
}
```

### How to Use Authenticated Endpoints

1. **Register/Login** to get a JWT token
2. **Store the token** in your frontend (localStorage, sessionStorage, or httpOnly cookie)
3. **Send the token** in the `Authorization` header for each request:

```javascript
// Frontend Example (JavaScript)
const token = localStorage.getItem('token');

fetch('/api/orders', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🖼️ Image Storage with Cloudinary

Your application now uses **Cloudinary** for cloud-based image storage instead of local file storage.

### Cloudinary Setup

#### 1. **Create a Cloudinary Account**
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for a free account
- Go to your dashboard to find credentials

#### 2. **Get Your Cloudinary Credentials**
In your Cloudinary Dashboard:
1. Navigate to Settings (⚙️ icon)
2. Find your **Cloud Name**, **API Key**, and **API Secret**

#### 3. **Update Environment Variables**

Update your `.env` file in the backend folder:

```env
# Cloudinary Configuration (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace with your actual Cloudinary credentials.

### Image Upload Features

#### Product Image Upload (`POST /api/products`)
When creating a product, you can provide an image URL:

**Request Example:**
```json
{
  "name": "Fresh Tomatoes",
  "price": 150,
  "image_url": "https://example.com/image.jpg",
  "description": "Organic fresh tomatoes",
  "category": "Vegetables",
  "quantity": 100
}
```

**What Happens:**
1. The image URL is uploaded to Cloudinary
2. Cloudinary returns a secure HTTPS URL
3. The secure URL is stored in MongoDB
4. All images are organized in the `smart-farm-village/products` folder

#### Image Features

- **Automatic Optimization**: Cloudinary automatically optimizes images for web
- **Format Conversion**: Converts to optimal formats (WebP, JPEG, PNG, etc.)
- **Responsive Images**: Generate responsive versions with different dimensions
- **Security**: All images served over HTTPS
- **CDN Delivery**: Images delivered via Cloudinary's global CDN
- **Storage Limits**: Free plan includes 25GB storage

### Cloudinary Utility Functions

Location: `backend/utils/cloudinaryUpload.js`

Available functions:

```javascript
// Upload image from URL
const result = await uploadImageUrl(imageUrl, folder);
// Returns: { url, publicId, width, height }

// Delete image
await deleteImage(publicId);

// Get optimized image URL with transformations
const optimizedUrl = getOptimizedImageUrl(publicId, {
  width: 300,
  height: 300,
  crop: 'fill'
});
```

### Image Transformation Examples

Cloudinary allows you to transform images on-the-fly:

```javascript
// Resize and optimize
https://res.cloudinary.com/[cloud_name]/image/upload/w_300,h_300,c_fill,q_auto,f_auto/[public_id]

// Circular crop
https://res.cloudinary.com/[cloud_name]/image/upload/r_max,c_fill/[public_id]

// Blur effect
https://res.cloudinary.com/[cloud_name]/image/upload/e_blur:300/[public_id]
```

---

## 🔒 Security Best Practices Implemented

### 1. **Password Security**
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never stored in plain text
- Always validated on login

### 2. **JWT Token Security**
- Tokens expire after 7 days
- Cannot be modified without the secret key
- Token validation checks user still exists in database
- Tokens must be sent in Authorization header

### 3. **Request Validation**
- All inputs are validated before processing
- Error messages don't reveal sensitive information in production
- Rate limiting: 100 requests per 15 minutes per IP

### 4. **Resource Ownership Verification**
- Users can only access their own orders and cart
- Sellers can only view orders for their own products
- Admins have full access with role verification

### 5. **CORS & Security Headers**
- CORS enabled for frontend URL (configurable in .env)
- Helmet.js provides HTTP security headers
- Compression enabled for reduced payload size
- Morgan logging for request monitoring

---

## ✅ Endpoint Security Status

### Public Endpoints (No Auth Required)
- `GET /api/products` - Browse all products
- `GET /api/products/:id` - View product details
- `GET /api/categories` - Get product categories
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Protected Endpoints (Auth Required)

**Buyer Routes:**
- ✅ `POST /api/orders` - Requires: verifyToken, isBuyer
- ✅ `GET /api/orders/:userId` - Requires: verifyToken, ownsResource
- ✅ `GET /api/cart/:userId` - Requires: verifyToken, ownsResource
- ✅ `POST /api/cart` - Requires: verifyToken, isBuyer
- ✅ `PUT /api/cart/:userId/:productId` - Requires: verifyToken, ownsResource
- ✅ `DELETE /api/cart/:userId/:productId` - Requires: verifyToken, ownsResource

**Seller Routes:**
- ✅ `POST /api/products` - Requires: verifyToken, isSeller

**Admin Routes:**
- ✅ `GET /api/admin/orders` - Requires: verifyToken, isAdmin
- ✅ `POST /api/admin/order-status` - Requires: verifyToken, isAdmin

**User Routes:**
- ✅ `GET /api/users/profile` - Requires: verifyToken
- ✅ `PUT /api/users/profile` - Requires: verifyToken
- ✅ `POST /api/logout` - Requires: verifyToken

---

## 🧪 Testing the Authentication

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "userType": "buyer"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Test Product Creation (Seller)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Apples",
    "price": 50,
    "image_url": "https://example.com/apple.jpg",
    "description": "Fresh organic apples",
    "category": "Fruits",
    "quantity": 100
  }'
```

---

## 📝 Next Steps

1. **Frontend Integration**
   - Implement login/registration pages
   - Store JWT token in localStorage/sessionStorage
   - Add Authorization header to API requests
   - Implement logout functionality

2. **Cloudinary Optimization**
   - Set up image transformations for different product categories
   - Create responsive image versions
   - Implement image caching strategies

3. **Database Initialization**
   - Run: `npm run migrate` (creates MongoDB collections)
   - Run: `npm run seed` (populates sample data)

4. **Testing**
   - Test all protected endpoints with valid tokens
   - Test invalid/expired tokens
   - Test role-based access (buyer, seller, admin)

---

## 🆘 Troubleshooting

### Issue: "Invalid token" error
**Solution:** 
- Ensure token is included in Authorization header
- Check token hasn't expired (7 days)
- Verify token format: `Bearer <token>`

### Issue: "Cloudinary upload failed"
**Solution:**
- Verify Cloudinary credentials in .env
- Check image URL is valid and accessible
- Ensure image file size < 10MB
- Check Cloudinary quota limits

### Issue: "User already exists"
**Solution:**
- Username is already taken
- Try a different username
- Use login instead if account already exists

### Issue: "Insufficient quantity" when ordering
**Solution:**
- Product doesn't have enough stock
- Reduce order quantity or try another product

---

## 📚 Resources

- **JWT Documentation**: https://jwt.io
- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com

---

**Version**: 1.0  
**Last Updated**: December 26, 2025  
**Status**: ✅ Production Ready
