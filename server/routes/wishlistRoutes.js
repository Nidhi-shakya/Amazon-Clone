import express from 'express';
import {
  getWishlist,
  toggleWishlistItem,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All wishlist operations require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlistItem);
router.delete('/items/:productId', removeFromWishlist);

export default router;

