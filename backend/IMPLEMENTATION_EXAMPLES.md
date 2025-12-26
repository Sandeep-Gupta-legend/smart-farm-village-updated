# MongoDB Implementation Examples

This document shows before/after examples of how the code was transformed from MySQL to MongoDB.

## 1. User Registration

### Before (MySQL)
```javascript
const query = `
  INSERT INTO users (name, age, address, mobile, username, password, user_type, gst_number, pan_card, bank_account, state)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const [result] = await pool.execute(query, [
  name, age || null, address || null, mobile || null, username, 
  hashedPassword, userType, gstNumber || null, panCard || null, 
  bankAccount || null, state || null
]);

res.status(201).json({ 
  message: 'Registration successful', 
  user: { id: result.insertId, name, username, userType } 
});
```

### After (MongoDB)
```javascript
const newUser = new User({
  name,
  age: age || null,
  address: address || null,
  mobile: mobile || null,
  username: username.toLowerCase(),
  password: hashedPassword,
  user_type: userType,
  gst_number: gstNumber || null,
  pan_card: panCard || null,
  bank_account: bankAccount || null,
  state: state || null
});

const savedUser = await newUser.save();

res.status(201).json({ 
  message: 'Registration successful', 
  user: { id: savedUser._id, name, username, userType } 
});
```

**Key Changes:**
- SQL INSERT → Mongoose model instantiation and save()
- Integer ID → MongoDB ObjectId (_id)
- Parameter binding → JavaScript object properties

---

## 2. User Login

### Before (MySQL)
```javascript
const query = 'SELECT * FROM users WHERE username = ? AND user_type = ? AND is_active = TRUE';
const [results] = await pool.execute(query, [username, userType]);

if (results.length === 0) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const user = results[0];
```

### After (MongoDB)
```javascript
const user = await User.findOne({ 
  username: username.toLowerCase(), 
  user_type: userType, 
  is_active: true 
});

if (!user) {
  return res.status(401).json({ error: 'Invalid credentials' });
}
```

**Key Changes:**
- SQL SELECT → Mongoose findOne()
- Array result → Single document or null
- SQL conditions → MongoDB query object

---

## 3. Product Listing with Search & Pagination

### Before (MySQL)
```javascript
let query = `
  SELECT p.*, u.name as seller_name, u.state as seller_state
  FROM products p 
  LEFT JOIN users u ON p.seller_id = u.id 
  WHERE p.quantity > 0 AND p.is_active = TRUE
`;

const params = [];

if (category) {
  query += ' AND p.category = ?';
  params.push(category);
}

if (search) {
  query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
  params.push(`%${search}%`, `%${search}%`);
}

query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
params.push(parseInt(limit), parseInt(offset));

const [products] = await pool.execute(query, params);

// Separate count query
let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE ...';
const [countResult] = await pool.execute(countQuery, countParams);
```

### After (MongoDB)
```javascript
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

// Count with same query
const total = await Product.countDocuments(query);
```

**Key Changes:**
- SQL query strings → MongoDB query objects
- LIKE → $regex with $options: 'i' for case-insensitive
- LEFT JOIN → populate() for data enrichment
- LIMIT/OFFSET → limit() and skip()
- Separate count query → countDocuments() with same query

---

## 4. Order Creation with Transactions

### Before (MySQL)
```javascript
const connection = await pool.getConnection();
await connection.beginTransaction();

try {
  // Create order
  const orderQuery = `INSERT INTO orders (...) VALUES (?, ...)`;
  const [orderResult] = await connection.execute(orderQuery, [...]);
  const orderId = orderResult.insertId;
  
  // Add order items
  const orderItemsQuery = `INSERT INTO order_items (order_id, ...) VALUES (?, ...)`;
  for (const item of products) {
    await connection.execute(orderItemsQuery, [...]);
    
    // Update product quantity
    await connection.execute(
      'UPDATE products SET quantity = quantity - ? WHERE id = ?',
      [item.quantity, item.product.id]
    );
  }
  
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

### After (MongoDB)
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const orderItems = [];
  
  for (const item of products) {
    const product = await Product.findById(item.product.id).session(session);
    
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
  
  // Create order with embedded items
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
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

**Key Changes:**
- beginTransaction() → startSession() and startTransaction()
- Separate tables → Embedded documents (order items in order)
- UPDATE with separate query → $inc operator
- commit()/rollback() → commitTransaction()/abortTransaction()
- connection.release() → session.endSession()

---

## 5. Cart Operations

### Before (MySQL)
```javascript
// Add to cart - Check if item exists
const [existingItem] = await pool.execute(
  'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
  [user_id, product_id]
);

if (existingItem.length > 0) {
  await pool.execute(
    'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
    [quantity, user_id, product_id]
  );
} else {
  await pool.execute(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [user_id, product_id, quantity]
  );
}
```

### After (MongoDB)
```javascript
// Add to cart - Check if item exists
let cartItem = await CartItem.findOne({ user_id, product_id });

if (cartItem) {
  cartItem.quantity += quantity;
  await cartItem.save();
} else {
  const newCartItem = new CartItem({
    user_id,
    product_id,
    quantity
  });
  await newCartItem.save();
}
```

**Key Changes:**
- IF/ELSE with separate queries → findOne() with conditional save()
- SQL INSERT → Mongoose new() and save()
- SQL UPDATE → Load object, modify, save()
- Cleaner, more readable code

---

## 6. Complex Join Query

### Before (MySQL)
```javascript
const query = `
  SELECT o.*, 
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'product_id', oi.product_id,
             'quantity', oi.quantity,
             'price', oi.price,
             'product_name', p.name
           )
         ) as items
  FROM orders o
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  WHERE o.buyer_id = ?
  GROUP BY o.id
  ORDER BY o.created_at DESC
`;

const [results] = await pool.execute(query, [userId]);
```

### After (MongoDB)
```javascript
const orders = await Order.find({ buyer_id: userId })
  .populate('items.product_id', 'name')
  .sort({ created_at: -1 });

// Items are already embedded - no join needed!
```

**Key Changes:**
- No need for separate order_items table
- Items embedded directly in order document
- populate() enriches referenced data
- Much simpler and more efficient query

---

## 7. Schema Validation

### Before (MySQL)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type ENUM('buyer', 'seller') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### After (MongoDB with Mongoose)
```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      default: null
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    user_type: {
      type: String,
      enum: ['buyer', 'seller'],
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);
```

**Key Changes:**
- SQL table definition → Mongoose schema object
- Type constraints → JavaScript type definitions
- Unique constraint → unique: true option
- Auto timestamps → timestamps option
- More readable and maintainable

---

## 8. Database Connection Comparison

### Before (MySQL)
```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const connection = await pool.getConnection();
// ... use connection
connection.release();
```

### After (MongoDB)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

await connectDB();
// Mongoose handles connection pooling automatically
// No need to manually release connections
```

**Key Changes:**
- Multiple connection parameters → Single connection string
- Manual connection pool management → Automatic by Mongoose
- Manual connection release → Automatic cleanup
- Simpler configuration

---

## Summary of Benefits

| Aspect | MySQL | MongoDB |
|--------|-------|---------|
| Query Syntax | SQL strings | JavaScript objects |
| Joins | Complex LEFT JOINs | Simple populate() |
| Relationships | Foreign keys | Object references |
| Transactions | BEGIN/COMMIT | Sessions |
| Schema | Rigid | Flexible |
| Readability | SQL queries | JavaScript code |
| Type Safety | SQL constraints | Mongoose validation |
| Code Length | Longer SQL strings | Shorter JS code |
| Maintenance | SQL updates needed | Schema updates in code |

---

## Migration Strategy Used

1. ✅ Keep API signatures identical (no frontend changes)
2. ✅ Maintain same error messages (backward compatible)
3. ✅ Preserve business logic (no functionality lost)
4. ✅ Improve code readability (cleaner implementation)
5. ✅ Add proper validation (Mongoose schemas)
6. ✅ Implement best practices (sessions for transactions)

All changes focus on **modernization** while maintaining **compatibility**.
