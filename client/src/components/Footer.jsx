import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ marginTop: 'auto', backgroundColor: 'var(--amazon-navy-light)', color: '#ffffff' }}>
      {/* Back to Top button */}
      <button
        onClick={scrollToTop}
        style={{
          width: '100%',
          backgroundColor: '#37475a',
          color: '#ffffff',
          padding: '15px 0',
          fontSize: '13px',
          fontWeight: '600',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#485769')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#37475a')}
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '40px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
              Get to Know Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>About ShopZone</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Careers</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Press Releases</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>ShopZone Science</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
              Connect with Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#dddddd', fontSize: '13px' }}>GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#dddddd', fontSize: '13px' }}>LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#dddddd', fontSize: '13px' }}>Twitter</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
              Make Money with Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Sell on ShopZone</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Protect and Build Your Brand</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Supply to ShopZone</Link></li>
              <li><Link to="/products" style={{ color: '#dddddd', fontSize: '13px' }}>Become an Affiliate</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
              Let Us Help You
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/account" style={{ color: '#dddddd', fontSize: '13px' }}>Your Account</Link></li>
              <li><Link to="/orders" style={{ color: '#dddddd', fontSize: '13px' }}>Returns Centre</Link></li>
              <li><Link to="/products?isPrime=true" style={{ color: '#dddddd', fontSize: '13px' }}>100% Purchase Protection</Link></li>
              <li><Link to="/account" style={{ color: '#dddddd', fontSize: '13px' }}>Help & Customer Support</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #3a4553', margin: 0 }} />

      {/* Brand & Language Sub-footer */}
      <div
        style={{
          backgroundColor: 'var(--amazon-navy-dark)',
          padding: '28px 16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#cccccc',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
            Shop<span style={{ color: 'var(--amazon-gold)' }}>Zone</span>.in
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #848688',
              borderRadius: '3px',
              padding: '6px 12px',
            }}
          >
            <Globe size={14} />
            <span>English</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #848688',
              borderRadius: '3px',
              padding: '6px 12px',
            }}
          >
            <span>🇮🇳 India (₹ INR)</span>
          </div>
        </div>

        <p style={{ maxWidth: '680px', margin: '0 auto 8px', color: '#999999', fontSize: '11px' }}>
          ShopZone is a full-featured e-commerce demonstration application built for portfolio showcase purposes.
          All brand names, trademarks, and registered trademarks are the property of their respective owners.
        </p>
        <p style={{ color: '#999999', fontSize: '11px' }}>
          &copy; 2026 ShopZone.in, Inc. or its affiliates. Built with React &amp; Node.js.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

