import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const isOutOfStock = product.countInStock <= 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid #e7e7e7',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #d5d9d9',
          borderRadius: '50%',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'all 0.2s ease',
        }}
        title={isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          size={18}
          color={isFavorited ? '#cc0c39' : '#565959'}
          fill={isFavorited ? '#cc0c39' : 'transparent'}
        />
      </button>

      {/* Deal Badge */}
      {product.isDeal && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span className="deal-tag">
            {product.dealBadge || 'Limited Time Deal'}
          </span>
        </div>
      )}

      {/* Product Image */}
      <Link
        to={`/product/${product._id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '210px',
          padding: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=ShopZone'}
          alt={product.name}
          loading="lazy"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Brand & Category */}
      <div style={{ fontSize: '11px', color: '#565959', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        {product.brand} &bull; {product.category}
      </div>

      {/* Title */}
      <Link
        to={`/product/${product._id}`}
        style={{
          color: '#0f1111',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '1.35',
          height: '38px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '8px',
        }}
        title={product.name}
      >
        {product.name}
      </Link>

      {/* Star Rating */}
      <div style={{ marginBottom: '8px' }}>
        <Rating value={product.rating} count={product.numReviews} size={15} />
      </div>

      {/* Price Section */}
      <div style={{ marginBottom: '8px' }}>
        <div className="price-display">
          <span className="price-symbol">₹</span>
          <span className="price-main">
            {product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="price-mrp">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="price-discount">
                ({product.discountPercentage || Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Prime & Delivery */}
      <div style={{ marginBottom: '12px', fontSize: '12px', color: '#565959' }}>
        {product.isPrime && (
          <span className="prime-badge" style={{ marginRight: '6px' }}>
            <span className="checkmark"><Check size={14} strokeWidth={3} /></span> prime
          </span>
        )}
        <span>
          FREE delivery <strong>{product.deliveryDays === 1 ? 'Tomorrow' : 'in 2 days'}</strong>
        </span>
      </div>

      {/* Add to Cart Button */}
      <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
        <button
          className="btn-amazon-primary"
          style={{ width: '100%', padding: '9px 16px' }}
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

