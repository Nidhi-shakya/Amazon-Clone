import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Shield, MapPin, Heart, Headphones, Edit2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
  const { user, updateProfile } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name };
    if (password) payload.password = password;

    const res = await updateProfile(payload);
    if (res.success) {
      setIsEditingProfile(false);
      setPassword('');
    }
    setSubmitting(false);
  };

  const accountTiles = [
    {
      icon: <Package size={36} color="var(--amazon-orange)" />,
      title: 'Your Orders',
      desc: 'Track, return, or buy things again',
      to: '/orders',
    },
    {
      icon: <Heart size={36} color="var(--amazon-red-deal)" />,
      title: 'Your Wishlist',
      desc: 'Explore and manage your saved items',
      to: '/wishlist',
    },
    {
      icon: <Shield size={36} color="var(--amazon-blue-link)" />,
      title: 'Login & Security',
      desc: 'Edit name, email, and password settings',
      action: () => setIsEditingProfile(true),
    },
    {
      icon: <MapPin size={36} color="var(--amazon-green-stock)" />,
      title: 'Your Addresses',
      desc: 'Manage saved delivery addresses',
      to: '/checkout',
    },
    {
      icon: <Headphones size={36} color="var(--amazon-gold)" />,
      title: 'Customer Service',
      desc: 'Browse help topics, FAQs, and support',
      to: '/products',
    },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '85vh', padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f1111', marginBottom: '8px' }}>
          Your Account
        </h1>
        <p style={{ fontSize: '14px', color: '#565959', marginBottom: '28px' }}>
          Manage your ShopZone personal profile, delivery addresses, and past order history.
        </p>

        {/* Profile Edit Card if active */}
        {isEditingProfile && (
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #d5d9d9',
              marginBottom: '28px',
              maxWidth: '540px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px' }}>
              Update Login &amp; Security
            </h2>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d5d9d9', borderRadius: '4px', backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '11px', color: '#767676' }}>Email cannot be changed directly</span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  New Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-amazon-primary"
                  style={{ padding: '8px 18px' }}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-amazon-secondary"
                  style={{ padding: '8px 18px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2-3 Column Tiles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {accountTiles.map((tile, idx) => {
            const content = (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px',
                  border: '1px solid #d5d9d9',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7fafa';
                  e.currentTarget.style.borderColor = '#b7b9b9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#d5d9d9';
                }}
              >
                <div style={{ flexShrink: 0 }}>{tile.icon}</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f1111', marginBottom: '4px' }}>
                    {tile.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#565959', lineHeight: '1.4' }}>
                    {tile.desc}
                  </p>
                </div>
              </div>
            );

            return tile.to ? (
              <Link key={idx} to={tile.to} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            ) : (
              <div key={idx} onClick={tile.action}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

