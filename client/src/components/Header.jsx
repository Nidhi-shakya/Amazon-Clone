import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  User,
  Heart,
  Package,
  LogOut,
  X,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = [
  'All Categories',
  'Mobiles',
  'Electronics',
  'Audio',
  'Fashion',
  'Home & Kitchen',
  'Books',
];

const Header = ({ onOpenDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincode, setPincode] = useState(() => localStorage.getItem('shopzone_pincode') || '560103');
  const [tempPincode, setTempPincode] = useState(pincode);

  const accountRef = useRef(null);

  // Sync keyword from URL if on /products
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get('keyword');
    if (kw) setKeyword(kw);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (selectedCategory && selectedCategory !== 'All Categories') {
      params.set('category', selectedCategory);
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleSavePincode = (e) => {
    e.preventDefault();
    if (tempPincode.trim().length === 6) {
      setPincode(tempPincode.trim());
      localStorage.setItem('shopzone_pincode', tempPincode.trim());
      setShowLocationModal(false);
    }
  };

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--amazon-navy-dark)',
          color: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            gap: '12px',
          }}
        >
          {/* Mobile Drawer Button */}
          <button
            onClick={onOpenDrawer}
            aria-label="Open menu drawer"
            style={{
              background: 'none',
              color: '#ffffff',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '6px 8px',
              borderRadius: '2px',
              outline: '1px solid transparent',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.outline = '1px solid transparent')}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
                  Shop<span style={{ color: 'var(--amazon-gold)' }}>Zone</span>
                </span>
                <span style={{ fontSize: '12px', color: '#cccccc', marginLeft: '2px' }}>.in</span>
              </div>
              {/* Smile swoop curve */}
              <div
                style={{
                  height: '3px',
                  background: 'var(--amazon-orange)',
                  borderRadius: '2px',
                  width: '85%',
                  marginTop: '2px',
                }}
              />
            </div>
          </Link>

          {/* Delivery Location */}
          <div
            className="header-location-box"
            onClick={() => setShowLocationModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 8px',
              cursor: 'pointer',
              borderRadius: '2px',
              outline: '1px solid transparent',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.outline = '1px solid transparent')}
          >
            <MapPin size={18} color="#cccccc" style={{ marginTop: '6px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '11px', color: '#cccccc' }}>
                Deliver to {user ? user.name.split(' ')[0] : 'India'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                PIN {pincode}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: 1,
              display: 'flex',
              height: '40px',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                backgroundColor: '#f3f3f3',
                border: 'none',
                borderRight: '1px solid #cdcdcd',
                padding: '0 8px',
                fontSize: '12px',
                color: '#555555',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '130px',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Keyword Input */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search ShopZone.in"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  padding: '0 32px 0 12px',
                  fontSize: '14px',
                  color: '#0f1111',
                  outline: 'none',
                }}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    background: 'none',
                    color: '#888888',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              aria-label="Search"
              style={{
                backgroundColor: 'var(--amazon-gold)',
                border: 'none',
                width: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--amazon-orange)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--amazon-gold)')}
            >
              <Search size={20} color="#131921" />
            </button>
          </form>

          {/* Region / Currency */}
          <div
            className="header-lang-box"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 8px',
              cursor: 'pointer',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: '700',
              flexShrink: 0,
            }}
          >
            <span>🇮🇳</span>
            <span>EN</span>
          </div>

          {/* Account & Lists Dropdown Trigger */}
          <div
            ref={accountRef}
            style={{ position: 'relative', flexShrink: 0 }}
          >
            <div
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.2',
                padding: '6px 8px',
                cursor: 'pointer',
                borderRadius: '2px',
                outline: showAccountDropdown ? '1px solid #ffffff' : '1px solid transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
              onMouseLeave={(e) => {
                if (!showAccountDropdown) e.currentTarget.style.outline = '1px solid transparent';
              }}
            >
              <span style={{ fontSize: '11px', color: '#cccccc' }}>
                {isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, Sign in'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                  Account & Lists
                </span>
                <ChevronDown size={14} color="#cccccc" />
              </div>
            </div>

            {/* Account Popover Menu */}
            {showAccountDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '280px',
                  backgroundColor: '#ffffff',
                  color: '#0f1111',
                  borderRadius: '4px',
                  boxShadow: 'var(--shadow-dropdown)',
                  border: '1px solid #d5d9d9',
                  padding: '16px',
                  zIndex: 2000,
                  marginTop: '6px',
                }}
              >
                {!isAuthenticated ? (
                  <div style={{ textAlign: 'center', paddingBottom: '14px', borderBottom: '1px solid #e7e7e7' }}>
                    <Link
                      to="/login"
                      className="btn-amazon-primary"
                      style={{ width: '100%', marginBottom: '8px' }}
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      Sign in
                    </Link>
                    <div style={{ fontSize: '11px', color: '#565959' }}>
                      New customer?{' '}
                      <Link
                        to="/register"
                        style={{ color: 'var(--amazon-blue-link)', fontWeight: '600' }}
                        onClick={() => setShowAccountDropdown(false)}
                      >
                        Start here.
                      </Link>
                    </div>

                    {/* Quick Demo Credentials for Reviewers */}
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #d5d9d9', textAlign: 'left' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#565959', display: 'block', marginBottom: '6px' }}>
                        PORTFOLIO DEMO LOGIN:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          demoLogin('customer');
                          setShowAccountDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          background: '#f0f2f2',
                          border: '1px solid #d5d9d9',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          marginBottom: '4px',
                          textAlign: 'left',
                        }}
                      >
                        ⚡ Log in as Demo Customer (Rahul)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e7e7e7' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#565959' }}>{user.email}</div>
                  </div>
                )}

                {/* Account Navigation Links */}
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link
                    to="/account"
                    onClick={() => setShowAccountDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0f1111',
                      fontSize: '13px',
                      padding: '4px 0',
                    }}
                  >
                    <User size={16} color="#565959" /> Your Account
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setShowAccountDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0f1111',
                      fontSize: '13px',
                      padding: '4px 0',
                    }}
                  >
                    <Package size={16} color="#565959" /> Your Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowAccountDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0f1111',
                      fontSize: '13px',
                      padding: '4px 0',
                    }}
                  >
                    <Heart size={16} color="#565959" /> Your Wishlist ({wishlistCount})
                  </Link>

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        logout();
                        setShowAccountDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        color: 'var(--amazon-red-deal)',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '6px 0',
                        cursor: 'pointer',
                        marginTop: '6px',
                        borderTop: '1px solid #e7e7e7',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link
            to="/orders"
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: '1.2',
              padding: '6px 8px',
              textDecoration: 'none',
              borderRadius: '2px',
              outline: '1px solid transparent',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.outline = '1px solid transparent')}
          >
            <span style={{ fontSize: '11px', color: '#cccccc' }}>Returns</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>& Orders</span>
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              textDecoration: 'none',
              borderRadius: '2px',
              outline: '1px solid transparent',
              flexShrink: 0,
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.outline = '1px solid transparent')}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={28} color="#ffffff" />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  backgroundColor: 'var(--amazon-orange)',
                  color: '#131921',
                  fontWeight: '800',
                  fontSize: '13px',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {totalItems}
              </span>
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#ffffff',
                marginTop: '10px',
              }}
            >
              Cart
            </span>
          </Link>
        </div>
      </header>

      {/* Postal Code / Delivery Location Modal */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
          }}
          onClick={() => setShowLocationModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '420px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Choose your location</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', cursor: 'pointer', color: '#565959' }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#565959', marginBottom: '16px' }}>
              Select a delivery location to see product availability and delivery options in your area.
            </p>
            <form onSubmit={handleSavePincode}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Enter an Indian PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 560103"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #888c8c',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-amazon-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                Apply Location
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
