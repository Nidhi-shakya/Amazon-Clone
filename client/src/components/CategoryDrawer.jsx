import React from 'react';
import { Link } from 'react-router-dom';
import { X, User, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CategoryDrawer = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 4000,
        display: 'flex',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '365px',
          maxWidth: '85vw',
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInLeft 0.25s ease-out',
          boxShadow: '4px 0 16px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            backgroundColor: 'var(--amazon-navy-light)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700' }}>
              Hello, {isAuthenticated ? user.name : 'Sign in'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 0',
          }}
        >
          {/* Trending Section */}
          <div style={{ padding: '0 20px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              Trending
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                to="/products?isDeal=true"
                onClick={onClose}
                style={{
                  padding: '10px 0',
                  color: '#0f1111',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                Today's Deals <ChevronRight size={16} color="#767676" />
              </Link>
              <Link
                to="/products?sort=rating"
                onClick={onClose}
                style={{
                  padding: '10px 0',
                  color: '#0f1111',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                Best Sellers <ChevronRight size={16} color="#767676" />
              </Link>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #d5d9d9', margin: '8px 0' }} />

          {/* Shop By Category */}
          <div style={{ padding: '0 20px', margin: '16px 0' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              Shop By Category
            </h4>
            {[
              { name: 'Mobiles & Smartphones', to: '/products?category=Mobiles' },
              { name: 'Computers & Electronics', to: '/products?category=Electronics' },
              { name: 'Headphones & Audio', to: '/products?category=Audio' },
              { name: "Men's & Women's Fashion", to: '/products?category=Fashion' },
              { name: 'Home & Kitchen Appliances', to: '/products?category=Home%20%26%20Kitchen' },
              { name: 'Books & Learning', to: '/products?category=Books' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                onClick={onClose}
                style={{
                  padding: '10px 0',
                  color: '#0f1111',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
              >
                {cat.name} <ChevronRight size={16} color="#767676" />
              </Link>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #d5d9d9', margin: '8px 0' }} />

          {/* Help & Settings */}
          <div style={{ padding: '0 20px', marginTop: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              Help & Settings
            </h4>
            <Link
              to="/account"
              onClick={onClose}
              style={{ padding: '10px 0', color: '#0f1111', display: 'block', fontSize: '14px' }}
            >
              Your Account
            </Link>
            <Link
              to="/orders"
              onClick={onClose}
              style={{ padding: '10px 0', color: '#0f1111', display: 'block', fontSize: '14px' }}
            >
              Customer Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={onClose}
              style={{ padding: '10px 0', color: '#0f1111', display: 'block', fontSize: '14px' }}
            >
              Wishlist
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  color: 'var(--amazon-red-deal)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '10px 0',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                style={{
                  marginTop: '12px',
                  display: 'block',
                  color: 'var(--amazon-blue-link)',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 0',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDrawer;

