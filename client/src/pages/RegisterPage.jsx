import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Passwords must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 16px 60px',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#131921', letterSpacing: '-0.5px' }}>
            Shop<span style={{ color: 'var(--amazon-gold)' }}>Zone</span>
          </span>
          <span style={{ fontSize: '16px', color: '#565959', marginLeft: '2px' }}>.in</span>
        </div>
      </Link>

      {/* Main Registration Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '24px 28px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#0f1111' }}>
          Create Account
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca',
              color: 'var(--amazon-red-deal)',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              Your name
            </label>
            <input
              type="text"
              required
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #888c8c',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #888c8c',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #888c8c',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: '#565959' }}>
              <Info size={12} />
              <span>Passwords must be at least 6 characters.</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              Re-enter password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #888c8c',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-amazon-primary"
            style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: '600' }}
          >
            {loading ? 'Creating account...' : 'Create your ShopZone account'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#565959', marginTop: '16px', lineHeight: '1.4' }}>
          By creating an account or logging in you agree to ShopZone's Conditions of Use and Privacy Notice.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '20px 0' }} />

        <div style={{ fontSize: '13px', color: '#0f1111' }}>
          Already have an account?{' '}
          <Link
            to={`/login${location.search}`}
            style={{ color: 'var(--amazon-blue-link)', fontWeight: '600' }}
          >
            Sign in &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

