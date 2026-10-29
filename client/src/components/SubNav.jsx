import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';

const SubNav = ({ onOpenDrawer }) => {
  const location = useLocation();

  const links = [
    { label: 'All Products', to: '/products' },
    { label: 'Mobiles', to: '/products?category=Mobiles' },
    { label: "Today's Deals", to: '/products?isDeal=true' },
    { label: 'Electronics', to: '/products?category=Electronics' },
    { label: 'Audio', to: '/products?category=Audio' },
    { label: 'Fashion', to: '/products?category=Fashion' },
    { label: 'Home & Kitchen', to: '/products?category=Home%20%26%20Kitchen' },
    { label: 'Books', to: '/products?category=Books' },
  ];

  return (
    <nav
      style={{
        backgroundColor: 'var(--amazon-navy-light)',
        color: '#ffffff',
        height: '40px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Hamburger All button */}
          <button
            onClick={onOpenDrawer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              color: '#ffffff',
              padding: '6px 10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              borderRadius: '2px',
              outline: '1px solid transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.outline = '1px solid transparent')}
          >
            <Menu size={18} />
            All
          </button>

          {/* Category nav links */}
          {links.map((link) => {
            const isActive =
              location.pathname + location.search === link.to;

            return (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '6px 10px',
                  borderRadius: '2px',
                  fontWeight: isActive ? '700' : '500',
                  outline: isActive ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.outline = '1px solid #ffffff')}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.outline = '1px solid transparent';
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side Prime Badge highlight */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--amazon-gold)',
            fontWeight: '600',
            fontSize: '12px',
            padding: '4px 8px',
          }}
        >
          <Zap size={14} fill="var(--amazon-gold)" />
          <span>ShopZone Prime &bull; Fast, Free Delivery</span>
        </div>
      </div>
    </nav>
  );
};

export default SubNav;

