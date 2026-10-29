import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  ShoppingCart,
  Zap,
  MapPin,
  Lock,
} from 'lucide-react';
import Rating from '../components/Rating';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pincode = localStorage.getItem('shopzone_pincode') || '560103';

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await productsApi.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images?.[0] || '');
          setRelated(res.related || []);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" />
        <p style={{ marginTop: '12px', color: '#565959' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
          {error || 'Product not found'}
        </h2>
        <p style={{ color: '#565959', marginBottom: '24px' }}>
          The product you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/products" className="btn-amazon-primary">
          Back to all products
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const isOutOfStock = product.countInStock <= 0;

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '16px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '12px', color: '#565959', marginBottom: '16px' }}>
          <Link to="/" style={{ color: '#565959' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>&rsaquo;</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#565959' }}>
            {product.category}
          </Link>
          <span style={{ margin: '0 6px' }}>&rsaquo;</span>
          <span style={{ color: '#0f1111', fontWeight: '500' }}>{product.brand}</span>
        </div>

        {/* 3-Column Main Product Detail Layout */}
        <div
          className="product-details-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 420px) 1fr 280px',
            gap: '32px',
            alignItems: 'start',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Image Gallery */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {/* Thumbnails list */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.images.map((imgUrl, idx) => {
                  const isSelected = imgUrl === selectedImage;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setSelectedImage(imgUrl)}
                      onClick={() => setSelectedImage(imgUrl)}
                      style={{
                        width: '54px',
                        height: '54px',
                        border: isSelected ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        padding: '2px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Main Preview Image */}
            <div
              style={{
                flex: 1,
                height: '440px',
                border: '1px solid #e7e7e7',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                position: 'relative',
              }}
            >
              {/* Wishlist toggle button on image */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #d5d9d9',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <Heart
                  size={20}
                  color={isFavorited ? '#cc0c39' : '#565959'}
                  fill={isFavorited ? '#cc0c39' : 'transparent'}
                />
              </button>

              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          {/* Column 2: Product Specifications & Details */}
          <div>
            <div style={{ fontSize: '13px', color: 'var(--amazon-blue-link)', fontWeight: '600', marginBottom: '4px' }}>
              Brand: {product.brand}
            </div>

            <h1
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#0f1111',
                lineHeight: '1.3',
                marginBottom: '10px',
              }}
            >
              {product.name}
            </h1>

            {/* Rating & Reviews summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Rating value={product.rating} count={product.numReviews} size={18} />
              <span style={{ fontSize: '13px', color: '#565959' }}>&bull;</span>
              <span style={{ fontSize: '13px', color: '#565959' }}>
                1,000+ bought in past month
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            {/* Deal Badge */}
            {product.isDeal && (
              <div style={{ marginBottom: '10px' }}>
                <span className="deal-tag" style={{ fontSize: '12px', padding: '4px 8px' }}>
                  {product.dealBadge || 'Deal of the Day'}
                </span>
              </div>
            )}

            {/* Price Box */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                {product.discountPercentage > 0 && (
                  <span style={{ color: 'var(--amazon-red-deal)', fontSize: '24px', fontWeight: '400' }}>
                    -{product.discountPercentage}%
                  </span>
                )}
                <span style={{ fontSize: '14px', fontWeight: '500', verticalAlign: 'top' }}>₹</span>
                <span style={{ fontSize: '30px', fontWeight: '700', color: '#0f1111', letterSpacing: '-0.5px' }}>
                  {product.price.toLocaleString('en-IN')}
                </span>
              </div>

              {product.mrp > product.price && (
                <div style={{ fontSize: '13px', color: '#565959', marginTop: '2px' }}>
                  M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#0f1111', marginTop: '4px' }}>
                Inclusive of all taxes
              </div>
              <div style={{ fontSize: '12px', color: '#565959', marginTop: '2px' }}>
                EMI starts at ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month. No Cost EMI available.
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            {/* Value Props Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                textAlign: 'center',
                margin: '16px 0',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <div>
                <RotateCcw size={22} color="var(--amazon-orange)" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600' }}>7 Days Replacement</div>
              </div>
              <div>
                <Truck size={22} color="var(--amazon-orange)" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600' }}>Free Fast Delivery</div>
              </div>
              <div>
                <ShieldCheck size={22} color="var(--amazon-orange)" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600' }}>1 Year Warranty</div>
              </div>
            </div>

            {/* Specifications Table */}
            {product.specs?.length > 0 && (
              <div style={{ margin: '20px 0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
                  Technical Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: '13px' }}>
                  {product.specs.map((spec, i) => (
                    <React.Fragment key={i}>
                      <span style={{ color: '#565959', fontWeight: '600' }}>{spec.name}</span>
                      <span style={{ color: '#0f1111' }}>{spec.value}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* About Item Bullets */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
                About this item
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#0f1111', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
          </div>

          {/* Column 3: Amazon Buy Box */}
          <div
            style={{
              border: '1px solid #d5d9d9',
              borderRadius: '8px',
              padding: '18px',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Price in Buy Box */}
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f1111', marginBottom: '8px' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            {/* Delivery Info */}
            <div style={{ fontSize: '13px', color: '#0f1111', marginBottom: '12px', lineHeight: '1.4' }}>
              {product.isPrime && (
                <div style={{ marginBottom: '4px' }}>
                  <span className="prime-badge">
                    <span className="checkmark"><Check size={14} strokeWidth={3} /></span> prime
                  </span>
                </div>
              )}
              <div>
                FREE delivery <strong>{product.deliveryDays === 1 ? 'Tomorrow' : 'in 2 days'}</strong>
              </div>
            </div>

            {/* Deliver To */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--amazon-blue-link)',
                marginBottom: '16px',
              }}
            >
              <MapPin size={14} color="#565959" />
              <span>Deliver to India - PIN {pincode}</span>
            </div>

            {/* Stock Availability */}
            <div style={{ marginBottom: '16px' }}>
              {!isOutOfStock ? (
                <span style={{ fontSize: '18px', color: 'var(--amazon-green-stock)', fontWeight: '700' }}>
                  In stock
                </span>
              ) : (
                <span style={{ fontSize: '18px', color: 'var(--amazon-red-deal)', fontWeight: '700' }}>
                  Currently unavailable
                </span>
              )}
              {product.countInStock > 0 && product.countInStock <= 5 && (
                <div style={{ fontSize: '12px', color: 'var(--amazon-red-deal)', marginTop: '2px' }}>
                  Only {product.countInStock} left in stock - order soon.
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="quantity-select" style={{ fontSize: '13px', color: '#565959' }}>
                  Quantity:
                </label>
                <select
                  id="quantity-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d5d9d9',
                    backgroundColor: '#f0f2f2',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <button
                className="btn-amazon-primary"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>

              <button
                className="btn-amazon-buy"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>

            {/* Security Guarantee */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#565959',
                paddingTop: '12px',
                borderTop: '1px solid #e7e7e7',
                marginBottom: '12px',
              }}
            >
              <Lock size={16} color="#565959" />
              <span>Secure transaction &bull; SSL encrypted</span>
            </div>

            <div style={{ fontSize: '12px', color: '#565959', lineHeight: '1.5' }}>
              <div>Ships from: <strong>ShopZone India</strong></div>
              <div>Sold by: <strong>{product.brand} Retail Official</strong></div>
            </div>

            {/* Add to Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="btn-amazon-secondary"
              style={{ width: '100%', marginTop: '16px', padding: '8px' }}
            >
              <Heart
                size={16}
                color={isFavorited ? '#cc0c39' : '#565959'}
                fill={isFavorited ? '#cc0c39' : 'transparent'}
              />
              {isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

        {/* Related Products Carousel */}
        {related?.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <HorizontalScrollSection
              title="Customers who viewed this item also viewed"
              products={related}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
