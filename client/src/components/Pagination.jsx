import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        margin: '32px 0',
      }}
    >
      {/* Previous Button */}
      <button
        className="btn-amazon-secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '6px 12px' }}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {/* Page Numbers */}
      {pages.map((p) => {
        const isSelected = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: isSelected ? '1px solid var(--amazon-orange)' : '1px solid #d5d9d9',
              backgroundColor: isSelected ? '#fef8f2' : '#ffffff',
              fontWeight: isSelected ? '700' : '400',
              color: isSelected ? 'var(--amazon-orange)' : '#0f1111',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className="btn-amazon-secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '6px 12px' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;

