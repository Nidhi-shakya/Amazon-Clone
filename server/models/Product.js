import mongoose from 'mongoose';

const specSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price must be positive'],
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP must be positive'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.2,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      validate: [array => array.length > 0, 'At least one image is required'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Count in stock is required'],
      min: [0, 'Count in stock cannot be negative'],
      default: 15,
    },
    specs: [specSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeal: {
      type: Boolean,
      default: false,
    },
    dealBadge: {
      type: String,
      default: '',
    },
    isPrime: {
      type: Boolean,
      default: true,
    },
    deliveryDays: {
      type: Number,
      default: 2,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Calculate discount percentage before saving
productSchema.pre('save', function (next) {
  if (this.mrp && this.price && this.mrp > this.price) {
    this.discountPercentage = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discountPercentage = 0;
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;

