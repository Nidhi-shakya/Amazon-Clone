import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Rating from '../components/Rating';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '80vh', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Heart size={36} color="var(--amazon-red-deal)" />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              Your Wishlist is empty
            </h2>
            <p style={{ color: '#565959', fontSize: '14px', marginBottom: '24px' }}>
              Save items you love by clicking the heart icon on any product page or card.
            </p>
            <Link to="/products" className="btn-amazon-primary" style={{ padding: '10px 24px' }}>
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '85vh', padding: '24px 0 60px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#0f1111' }}>
            Your Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
          </h1>
          <Link to="/products" style={{ color: 'var(--amazon-blue-link)', fontSize: '14px' }}>
            Continue shopping
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              style={{
                border: '1px solid #d5d9d9',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}
            >
              <Link
                to={`/product/${product._id}`}
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  marginBottom: '12px',
                }}
              >
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </Link>

              <div style={{ fontSize: '11px', color: '#565959', textTransform: 'uppercase', marginBottom: '4px' }}>
                {product.brand}
              </div>

              <Link
                to={`/product/${product._id}`}
                style={{
                  color: '#0f1111',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  height: '38px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  marginBottom: '8px',
                }}
              >
                {product.name}
              </Link>

              <div style={{ marginBottom: '8px' }}>
                <Rating value={product.rating} count={product.numReviews} size={14} />
              </div>

              <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f1111', marginBottom: '14px' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn-amazon-primary"
                  style={{ width: '100%', padding: '8px' }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#565959',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

