// utils/cloudinaryUpload.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-farm-village/products', // Store in a specific folder
    resource_type: 'auto', // Auto-detect file type
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
  }
};

// Create multer middleware
const uploadToCloudinary = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Direct upload function for image URLs
const uploadImageUrl = async (imageUrl, folder = 'smart-farm-village/products') => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

// Get image from Cloudinary with transformations
const getOptimizedImageUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      width: 500,
      height: 500,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    return cloudinary.url(publicId, mergedOptions);
  } catch (error) {
    throw new Error(`Failed to generate image URL: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadImageUrl,
  deleteImage,
  getOptimizedImageUrl,
  cloudinary,
};
