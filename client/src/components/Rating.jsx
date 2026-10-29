import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value = 0, count, size = 16, showCount = true }) => {
  const numericValue = Number(value) || 0;
  const fullStars = Math.floor(numericValue);
  const hasHalfStar = numericValue % 1 >= 0.3 && numericValue % 1 <= 0.8;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="rating-container" title={`${numericValue.toFixed(1)} out of 5 stars`}>
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            fill="var(--amazon-star-amber)"
            stroke="var(--amazon-star-amber)"
          />
        ))}

        {hasHalfStar && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Star size={size} stroke="var(--amazon-star-amber)" fill="transparent" />
            <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: '50%' }}>
              <Star size={size} stroke="var(--amazon-star-amber)" fill="var(--amazon-star-amber)" />
            </div>
          </div>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            stroke="var(--amazon-star-amber)"
            fill="transparent"
          />
        ))}
      </div>

      {showCount && count !== undefined && (
        <span className="rating-count">
          {Number(count).toLocaleString('en-IN')}
        </span>
      )}
    </div>
  );
};

export default Rating;

