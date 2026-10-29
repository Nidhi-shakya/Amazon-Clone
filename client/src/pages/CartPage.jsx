import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Heart, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalItems,
    subtotal,
    deliveryCharge,
    total,
    isEligibleForFreeDelivery,
    amountNeededForFreeDelivery,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleMoveToWishlist = (item) => {
    const product = item.product || item;
    toggleWishlist(product);
    removeFromCart(product._id || product);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '80vh', padding: '32px 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#fef8f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <ShoppingBag size={40} color="var(--amazon-orange)" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Your ShopZone Cart is empty
            </h2>
            <p style={{ color: '#565959', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px' }}>
              Your shopping cart is waiting. Give it purpose – fill it with groceries, electronics, books, clothing and more.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/products?isDeal=true" className="btn-amazon-primary" style={{ padding: '10px 24px' }}>
                Shop Today's Deals
              </Link>
              <Link to="/products" className="btn-amazon-secondary" style={{ padding: '10px 24px' }}>
                Continue Shopping
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn-amazon-secondary" style={{ padding: '10px 24px' }}>
                  Sign in to your account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '85vh', padding: '24px 0 60px' }}>
      <div className="container">
        <div
          className="cart-layout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Cart Items List */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingBottom: '14px',
                borderBottom: '1px solid #e7e7e7',
              }}
            >
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f1111' }}>
                  Shopping Cart
                </h1>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--amazon-blue-link)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '4px',
                  }}
                >
                  Deselect / Clear all items
                </button>
              </div>
              <span style={{ fontSize: '13px', color: '#565959', fontWeight: '500' }}>Price</span>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cartItems.map((item) => {
                const product = item.product || item;
                const price = product.price || item.price;
                const mrp = product.mrp;
                const images = product.images || [];

                return (
                  <div
                    key={product._id || item._id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '20px 0',
                      borderBottom: '1px solid #e7e7e7',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Item Thumbnail */}
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e7e7e7',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={images[0] || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </Link>

                    {/* Item Info */}
                    <div style={{ flex: 1 }}>
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0f1111',
                          textDecoration: 'none',
                          lineHeight: '1.3',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        {product.name}
                      </Link>

                      <div style={{ fontSize: '12px', color: 'var(--amazon-green-stock)', fontWeight: '600', marginBottom: '6px' }}>
                        In stock
                      </div>

                      {product.isPrime && (
                        <div style={{ marginBottom: '8px' }}>
                          <span className="prime-badge" style={{ fontSize: '12px' }}>
                            <span className="checkmark">&check;</span> prime
                          </span>
                        </div>
                      )}

                      {/* Controls: Quantity Selector, Delete, Wishlist */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {/* Quantity Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#565959' }}>Qty:</span>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(product._id, Number(e.target.value))}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #d5d9d9',
                              backgroundColor: '#f0f2f2',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <span style={{ color: '#d5d9d9' }}>|</span>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(product._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--amazon-blue-link)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Delete
                        </button>

                        <span style={{ color: '#d5d9d9' }}>|</span>

                        {/* Save for later / Move to Wishlist */}
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--amazon-blue-link)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Save for later / Wishlist
                        </button>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f1111' }}>
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>
                          (₹{price.toLocaleString('en-IN')} each)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal line at bottom */}
            <div style={{ textAlign: 'right', paddingTop: '16px', fontSize: '18px' }}>
              <span>
                Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):{' '}
                <strong style={{ fontWeight: '700', color: '#0f1111' }}>
                  ₹{subtotal.toLocaleString('en-IN')}
                </strong>
              </span>
            </div>
          </div>

          {/* Right Column: Checkout Summary Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: 'var(--shadow-card)',
              position: 'sticky',
              top: '80px',
            }}
          >
            {/* Free Delivery Status Banner */}
            <div style={{ marginBottom: '16px' }}>
              {isEligibleForFreeDelivery ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--amazon-green-stock)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--amazon-green-stock)', fontWeight: '600', lineHeight: '1.4' }}>
                    Part of your order qualifies for FREE Delivery. Choose this option at checkout.
                  </span>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <AlertCircle size={16} color="var(--amazon-orange)" />
                    <span style={{ fontSize: '12px', color: '#0f1111', fontWeight: '500' }}>
                      Add <strong>₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</strong> of eligible items for FREE Delivery
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '6px', width: '100%', backgroundColor: '#e7e7e7', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progressPercentage}%`,
                        backgroundColor: 'var(--amazon-green-stock)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subtotal summary */}
            <div style={{ fontSize: '18px', marginBottom: '14px' }}>
              Subtotal ({totalItems} items):{' '}
              <strong style={{ fontWeight: '700' }}>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>

            {/* Delivery charge indication */}
            <div style={{ fontSize: '13px', color: '#565959', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Delivery:</span>
              <span style={{ fontWeight: '600', color: deliveryCharge === 0 ? 'var(--amazon-green-stock)' : '#0f1111' }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>

            {/* Gift Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0f1111', marginBottom: '20px', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>This order contains a gift</span>
            </label>

            {/* Proceed to Buy Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-amazon-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '600' }}
            >
              Proceed to Buy ({totalItems} items) <ArrowRight size={16} />
            </button>

            {/* EMI options promo */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #e7e7e7',
                fontSize: '12px',
                color: '#565959',
                lineHeight: '1.4',
              }}
            >
              <strong>EMI Available</strong> on credit &amp; debit cards. No Cost EMI available on select items.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
