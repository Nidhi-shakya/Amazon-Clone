import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'The Great Indian Festival is Live',
    subtitle: 'Up to 60% off on Smartphones, Laptops & Smartwatches',
    ctaText: 'Shop All Deals',
    ctaLink: '/products?isDeal=true',
    bgGradient: 'linear-gradient(135deg, #131921 0%, #1f2a38 50%, #febd69 100%)',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    tag: 'MEGA SALE',
  },
  {
    id: 2,
    title: 'Next-Gen Smartphones & Accessories',
    subtitle: 'iPhone 15, Galaxy S24 Ultra & OnePlus 12 with No Cost EMI',
    ctaText: 'Explore Flagships',
    ctaLink: '/products?category=Mobiles',
    bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    tag: 'NEW LAUNCHES',
  },
  {
    id: 3,
    title: 'Immersive Sound & Audio Gear',
    subtitle: 'Sony XM5, AirPods Pro & JBL Bluetooth Speakers on Prime Delivery',
    ctaText: 'Shop Audio Gear',
    ctaLink: '/products?category=Audio',
    bgGradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    tag: 'PRIME EXCLUSIVE',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      style={{
        position: 'relative',
        height: '380px',
        width: '100%',
        overflow: 'hidden',
        background: slide.bgGradient,
        transition: 'background 0.5s ease',
      }}
    >
      {/* Slide Content */}
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          padding: '0 40px',
        }}
      >
        <div style={{ maxWidth: '540px', color: '#ffffff' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--amazon-red-deal)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '3px',
              marginBottom: '12px',
              letterSpacing: '0.8px',
            }}
          >
            {slide.tag}
          </div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '12px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {slide.title}
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#f0f2f2',
              marginBottom: '20px',
              lineHeight: '1.4',
            }}
          >
            {slide.subtitle}
          </p>
          <Link
            to={slide.ctaLink}
            className="btn-amazon-primary"
            style={{
              fontSize: '15px',
              padding: '12px 28px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {slide.ctaText}
          </Link>
        </div>

        {/* Hero Product Visual */}
        <div
          style={{
            height: '280px',
            width: '420px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'none',
          }}
          className="hero-image-desktop"
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '16px',
          top: '35%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          width: '44px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
      >
        <ChevronLeft size={30} color="#111111" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '16px',
          top: '35%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid #ffffff',
          borderRadius: '4px',
          width: '44px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)')}
      >
        <ChevronRight size={30} color="#111111" />
      </button>

      {/* Amazon signature bottom gradient overlay fading to #eaeded */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(234, 237, 237, 0) 0%, rgba(234, 237, 237, 1) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default HeroCarousel;

