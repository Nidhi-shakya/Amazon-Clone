import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const HorizontalScrollSection = ({ title, linkTo, linkText = 'See all deals', products = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f1111' }}>
          {title}
        </h2>
        {linkTo && (
          <Link
            to={linkTo}
            style={{
              fontSize: '14px',
              color: 'var(--amazon-blue-link)',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            {linkText}
          </Link>
        )}
      </div>

      {/* Left / Right arrow navigation buttons */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        style={{
          position: 'absolute',
          left: '10px',
          top: '55%',
          transform: 'translateY(-50%)',
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '4px',
          width: '38px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        }}
      >
        <ChevronLeft size={22} color="#0f1111" />
      </button>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        style={{
          position: 'absolute',
          right: '10px',
          top: '55%',
          transform: 'translateY(-50%)',
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '4px',
          width: '38px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        }}
      >
        <ChevronRight size={22} color="#0f1111" />
      </button>

      {/* Horizontally scrollable row */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          paddingBottom: '8px',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              flex: '0 0 240px',
              maxWidth: '240px',
              scrollSnapAlign: 'start',
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalScrollSection;

