const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: null
    }
  }
);

module.exports = mongoose.model('Category', categorySchema);
