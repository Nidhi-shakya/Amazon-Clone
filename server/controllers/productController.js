import Product from '../models/Product.js';

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      isPrime,
      isDeal,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Keyword search
    if (keyword && keyword.trim()) {
      const cleanKeyword = keyword.trim();
      query.$or = [
        { name: { $regex: cleanKeyword, $options: 'i' } },
        { description: { $regex: cleanKeyword, $options: 'i' } },
        { brand: { $regex: cleanKeyword, $options: 'i' } },
        { category: { $regex: cleanKeyword, $options: 'i' } },
        { tags: { $in: [new RegExp(cleanKeyword, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // In Stock filter
    if (inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Prime filter
    if (isPrime === 'true') {
      query.isPrime = true;
    }

    // Deal filter
    if (isDeal === 'true') {
      query.isDeal = true;
    }

    // Sorting options
    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'discount') {
      sortOption = { discountPercentage: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID with related products
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch up to 6 related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(6)
      .select('name price mrp discountPercentage images rating numReviews isPrime');

    res.json({
      success: true,
      data: product,
      related: relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories with counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categoriesWithCount = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const categories = categoriesWithCount.map((item) => ({
      name: item._id,
      count: item.count,
    }));

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products & deals for home page
// @route   GET /api/products/deals/featured
// @access  Public
export const getFeaturedDeals = async (req, res, next) => {
  try {
    const deals = await Product.find({ isDeal: true }).limit(10);
    const bestSellers = await Product.find({ rating: { $gte: 4.4 } })
      .sort({ numReviews: -1 })
      .limit(10);
    const featured = await Product.find({ isFeatured: true }).limit(8);

    res.json({
      success: true,
      data: {
        deals,
        bestSellers,
        featured,
      },
    });
  } catch (error) {
    next(error);
  }
};

