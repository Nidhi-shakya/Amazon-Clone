import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, linkText = 'See more', linkTo, items = [], singleImage, singleLabel }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)',
        zIndex: 5,
        height: '100%',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#0f1111',
          marginBottom: '14px',
          lineHeight: '1.25',
        }}
      >
        {title}
      </h3>

      {/* 4-Item Grid */}
      {items.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            flex: 1,
            marginBottom: '16px',
          }}
        >
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.to || linkTo}
              style={{
                textDecoration: 'none',
                color: '#0f1111',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '105px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#0f1111', lineHeight: '1.2' }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        /* Single Featured Image */
        <Link
          to={linkTo}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: '220px',
              backgroundColor: '#f7f7f7',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '6px',
            }}
          >
            <img
              src={singleImage}
              alt={title}
              loading="lazy"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          {singleLabel && (
            <span style={{ fontSize: '13px', color: '#0f1111' }}>{singleLabel}</span>
          )}
        </Link>
      )}

      {/* Link to view category */}
      <div style={{ marginTop: 'auto' }}>
        <Link
          to={linkTo}
          style={{
            fontSize: '13px',
            color: 'var(--amazon-blue-link)',
            fontWeight: '600',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--amazon-blue-link-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--amazon-blue-link)')}
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;

