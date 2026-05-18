const mongoose = require('mongoose');

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
    address: {
      type: String,
      default: null
    },
    mobile: {
      type: String,
      default: null,
      trim: true
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
      enum: ['buyer', 'seller', 'admin'],
      required: true
    },
    gst_number: {
      type: String,
      default: null
    },
    pan_card: {
      type: String,
      default: null
    },
    bank_account: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    }
    ,
    // Security fields for login attempts and temporary lockouts
    login_attempts: {
      type: Number,
      default: 0
    },
    lock_until: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = mongoose.model('User', userSchema);
