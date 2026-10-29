import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Home } from 'lucide-react';

const NotFoundPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '60px 16px' }}>
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
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
          <HelpCircle size={44} color="var(--amazon-orange)" />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f1111', marginBottom: '8px' }}>
          Looking for something?
        </h1>
        <p style={{ color: '#565959', fontSize: '15px', marginBottom: '28px', lineHeight: '1.5' }}>
          We're sorry. The Web address you entered is not a functioning page on our site.
        </p>

        {/* Quick Search */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            maxWidth: '460px',
            margin: '0 auto 28px',
            border: '2px solid var(--amazon-gold)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <input
            type="text"
            placeholder="Search ShopZone products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--amazon-gold)',
              border: 'none',
              padding: '0 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search size={20} color="#131921" />
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/" className="btn-amazon-primary" style={{ padding: '10px 24px' }}>
            <Home size={16} /> Go to ShopZone Home
          </Link>
          <Link to="/products?isDeal=true" className="btn-amazon-secondary" style={{ padding: '10px 24px' }}>
            Today's Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

