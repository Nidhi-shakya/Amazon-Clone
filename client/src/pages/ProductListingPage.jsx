import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Rating from '../components/Rating';
import { productsApi } from '../services/api';
import { Filter, X, Check, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Mobiles',
  'Electronics',
  'Audio',
  'Fashion',
  'Home & Kitchen',
  'Books',
];

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹20,000', min: 5000, max: 20000 },
  { label: '₹20,000 & Above', min: 20000, max: '' },
];

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract query params
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const isPrime = searchParams.get('isPrime') === 'true';
  const isDeal = searchParams.get('isDeal') === 'true';
  const inStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Custom price input state
  const [customMin, setCustomMin] = useState(minPrice);
  const [customMax, setCustomMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword,
        category: category !== 'All' ? category : undefined,
        sort,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        isPrime: isPrime ? 'true' : undefined,
        isDeal: isDeal ? 'true' : undefined,
        inStock: inStock ? 'true' : undefined,
        page: currentPage,
        limit: 12,
      };

      const res = await productsApi.getProducts(params);
      if (res.success) {
        setProducts(res.data);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, minPrice, maxPrice, rating, isPrime, isDeal, inStock, currentPage]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'All' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceRangeClick = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min !== undefined && min !== '') newParams.set('minPrice', min);
    else newParams.delete('minPrice');

    if (max !== undefined && max !== '') newParams.set('maxPrice', max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCustomPriceSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (customMin) newParams.set('minPrice', customMin);
    else newParams.delete('minPrice');

    if (customMax) newParams.set('maxPrice', customMax);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set('keyword', keyword);
    setSearchParams(newParams);
    setCustomMin('');
    setCustomMax('');
  };

  const hasActiveFilters = category !== 'All' || minPrice || maxPrice || rating || isPrime || isDeal || inStock;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '16px 0 40px' }}>
      <div className="container">
        {/* Results Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            borderBottom: '1px solid #e7e7e7',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '14px', color: '#565959' }}>
              Showing {products.length > 0 ? `${(page - 1) * 12 + 1}-${Math.min(page * 12, total)}` : 0} of {total} results
            </span>
            {keyword && (
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--amazon-orange)', marginLeft: '6px' }}>
                for "{keyword}"
              </span>
            )}
            {category !== 'All' && (
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f1111', marginLeft: '6px' }}>
                in "{category}"
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn-amazon-secondary"
              style={{ display: 'inline-flex', padding: '6px 12px' }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '13px', color: '#565959' }}>
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d5d9d9',
                  backgroundColor: '#f0f2f2',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left Sidebar Filter Column */}
          <aside
            className={`filter-sidebar ${mobileFilterOpen ? 'open' : ''}`}
            style={{
              width: '240px',
              flexShrink: 0,
              fontSize: '13px',
            }}
          >
            {mobileFilterOpen && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  color: 'var(--amazon-red-deal)',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
              >
                <X size={14} /> Clear all filters
              </button>
            )}

            {/* Category Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
                Department
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category.toLowerCase() === cat.toLowerCase();
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => updateParam('category', cat)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isSelected ? '#0f1111' : '#007185',
                          fontWeight: isSelected ? '700' : '400',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                          padding: '2px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isSelected && <span style={{ color: 'var(--amazon-orange)' }}>&bull;</span>}
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            {/* Customer Review Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
                Customer Reviews
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[4, 3].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => updateParam('rating', rating === String(stars) ? '' : String(stars))}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: rating === String(stars) ? '700' : '400',
                    }}
                  >
                    <Rating value={stars} showCount={false} size={15} />
                    <span>&amp; Up</span>
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            {/* Price Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
                Price
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {PRICE_RANGES.map((pr, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePriceRangeClick(pr.min, pr.max)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: minPrice === String(pr.min) && maxPrice === String(pr.max) ? '#0f1111' : '#007185',
                      fontWeight: minPrice === String(pr.min) && maxPrice === String(pr.max) ? '700' : '400',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textAlign: 'left',
                    }}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>

              {/* Custom Price Form */}
              <form onSubmit={handleCustomPriceSubmit} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="₹ Min"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  style={{
                    width: '65px',
                    padding: '4px 6px',
                    border: '1px solid #d5d9d9',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="₹ Max"
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  style={{
                    width: '65px',
                    padding: '4px 6px',
                    border: '1px solid #d5d9d9',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <button
                  type="submit"
                  className="btn-amazon-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  Go
                </button>
              </form>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            {/* Special Options: Prime, Deals, In Stock */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isPrime}
                  onChange={(e) => updateParam('isPrime', e.target.checked)}
                />
                <span className="prime-badge" style={{ fontSize: '12px' }}>
                  <span className="checkmark"><Check size={12} strokeWidth={3} /></span> prime
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDeal}
                  onChange={(e) => updateParam('isDeal', e.target.checked)}
                />
                <span style={{ fontSize: '13px', fontWeight: '500' }}>
                  Today's Deals
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateParam('inStock', e.target.checked)}
                />
                <span style={{ fontSize: '13px', color: '#007600', fontWeight: '600' }}>
                  Include In-Stock Only
                </span>
              </label>
            </div>
          </aside>

          {/* Right Main Grid */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div className="spinner" />
                <p style={{ marginTop: '12px', color: '#565959', fontSize: '14px' }}>
                  Loading matching products...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  border: '1px dashed #d5d9d9',
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                  No matching products found
                </h3>
                <p style={{ color: '#565959', fontSize: '14px', marginBottom: '16px' }}>
                  Try checking your spelling or using more general terms.
                </p>
                <button onClick={clearAllFilters} className="btn-amazon-primary">
                  View All Products
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={page}
                  totalPages={pages}
                  onPageChange={(newPage) => updateParam('page', newPage)}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
