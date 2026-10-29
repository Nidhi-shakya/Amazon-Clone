import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCard from '../components/CategoryCard';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import { productsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, demoLogin } = useAuth();
  const [deals, setDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await productsApi.getFeaturedDeals();
        if (res.success && res.data) {
          setDeals(res.data.deals || []);
          setBestSellers(res.data.bestSellers || []);
          setFeatured(res.data.featured || []);
        }
      } catch (err) {
        console.error('Failed to load homepage deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Main Container with overlapping cards */}
      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-120px' }}>
        {/* 4 Feature Category Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Card 1: Mobiles & Flagships */}
          <CategoryCard
            title="Latest Smartphones & 5G Mobiles"
            linkTo="/products?category=Mobiles"
            linkText="See all smartphones"
            items={[
              {
                label: 'iPhone 15',
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Mobiles',
              },
              {
                label: 'Galaxy S24 Ultra',
                image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Mobiles',
              },
              {
                label: 'OnePlus 12',
                image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Mobiles',
              },
              {
                label: 'Accessories',
                image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Mobiles',
              },
            ]}
          />

          {/* Card 2: Computers & Productivity */}
          <CategoryCard
            title="Laptops, Monitors & Workspaces"
            linkTo="/products?category=Electronics"
            linkText="Shop computer accessories"
            items={[
              {
                label: 'MacBook Air M2',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Electronics',
              },
              {
                label: '4K Monitors',
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Electronics',
              },
              {
                label: 'MX Master 3S',
                image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Electronics',
              },
              {
                label: 'Keyboards & Mice',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Electronics',
              },
            ]}
          />

          {/* Card 3: Noise Cancelling & Audio */}
          <CategoryCard
            title="Premium Audio & Headphones"
            linkTo="/products?category=Audio"
            linkText="Explore wireless audio"
            items={[
              {
                label: 'Sony WH-1000XM5',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Audio',
              },
              {
                label: 'AirPods Pro 2',
                image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Audio',
              },
              {
                label: 'JBL Bluetooth',
                image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Audio',
              },
              {
                label: 'Studio Audio',
                image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80',
                to: '/products?category=Audio',
              },
            ]}
          />

          {/* Card 4: Sign in / Personalized Card or Fashion */}
          {!isAuthenticated ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-card)',
                height: '100%',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
                  Sign in for your best experience
                </h3>
                <p style={{ fontSize: '13px', color: '#565959', marginBottom: '16px' }}>
                  Track orders, get Prime recommendations, and access your saved shopping cart across devices.
                </p>
                <Link
                  to="/login"
                  className="btn-amazon-primary"
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  Sign in securely
                </Link>

                <div style={{ marginTop: '14px', borderTop: '1px dashed #d5d9d9', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#565959', display: 'block', marginBottom: '6px' }}>
                    QUICK DEMO ONE-CLICK:
                  </span>
                  <button
                    type="button"
                    onClick={() => demoLogin('customer')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#f0f2f2',
                      border: '1px solid #d5d9d9',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    👤 Demo Customer (Rahul Sharma)
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80"
                  alt="Amazon Shopping"
                  style={{ borderRadius: '6px', maxHeight: '120px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ) : (
            <CategoryCard
              title={`Welcome back, ${user.name.split(' ')[0]}!`}
              linkTo="/orders"
              linkText="View order history"
              singleImage="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
              singleLabel="Trending picks & recommendations based on your activity"
            />
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Loading today's deals &amp; curated collections...
            </p>
          </div>
        )}

        {/* Horizontal Scroll Section 1: Today's Deals */}
        {!loading && deals.length > 0 && (
          <HorizontalScrollSection
            title="Today's Deals | Up to 50% Off"
            linkTo="/products?isDeal=true"
            linkText="See all deals"
            products={deals}
          />
        )}

        {/* Horizontal Scroll Section 2: Best Sellers */}
        {!loading && bestSellers.length > 0 && (
          <HorizontalScrollSection
            title="Best Sellers in Electronics & Tech"
            linkTo="/products?sort=rating"
            linkText="See all best sellers"
            products={bestSellers}
          />
        )}

        {/* Promo Banner Strip */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            margin: '24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-card)',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'linear-gradient(90deg, #ffffff 0%, #fdf8e2 100%)',
            border: '1px solid #fed89b',
          }}
        >
          <div>
            <span style={{ color: 'var(--amazon-red-deal)', fontWeight: '800', fontSize: '12px', letterSpacing: '0.5px' }}>
              SPECIAL PROMOTION
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f1111', margin: '4px 0 6px' }}>
              Free Delivery on Your First Order
            </h3>
            <p style={{ fontSize: '14px', color: '#565959' }}>
              Plus enjoy lightning-fast 1-day delivery on all Prime items across India.
            </p>
          </div>
          <Link
            to="/products"
            className="btn-amazon-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            Start Shopping Now
          </Link>
        </div>

        {/* Horizontal Scroll Section 3: Featured Products */}
        {!loading && featured.length > 0 && (
          <HorizontalScrollSection
            title="Curated Recommendations for You"
            linkTo="/products"
            linkText="Explore entire catalogue"
            products={featured}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

