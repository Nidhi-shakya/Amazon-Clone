import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract redirect target if any
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your email address and password');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleDemoSignIn = async (role) => {
    setError('');
    setLoading(true);
    const res = await demoLogin(role);
    if (res.success) {
      navigate(redirect);
    } else {
      setError(res.message || 'Demo login failed');
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
      {/* ShopZone Logo Header */}
      <Link to="/" style={{ textDecoration: 'none', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#131921', letterSpacing: '-0.5px' }}>
            Shop<span style={{ color: 'var(--amazon-gold)' }}>Zone</span>
          </span>
          <span style={{ fontSize: '16px', color: '#565959', marginLeft: '2px' }}>.in</span>
        </div>
      </Link>

      {/* Main Login Card */}
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
          Sign in
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
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
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

          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700' }}>
                Password
              </label>
              <span style={{ fontSize: '12px', color: 'var(--amazon-blue-link)', cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#565959', marginTop: '16px', lineHeight: '1.4' }}>
          By continuing, you agree to ShopZone's Conditions of Use and Privacy Notice.
        </p>

        {/* Quick Demo Fill Buttons for Portfolio Reviewers */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #d5d9d9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#565959', display: 'block', marginBottom: '8px' }}>
            PORTFOLIO ONE-CLICK REVIEW LOGINS:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoSignIn('customer')}
              className="btn-amazon-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '12px', justifyContent: 'flex-start' }}
            >
              👤 Sign in as Demo Customer (Rahul Sharma)
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="btn-amazon-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '12px', justifyContent: 'flex-start' }}
            >
              ⚡ Sign in as Demo Administrator
            </button>
          </div>
        </div>
      </div>

      {/* New Customer Divider & Register Link */}
      <div style={{ width: '100%', maxWidth: '380px', marginTop: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e7e7e7' }} />
          <span style={{ padding: '0 8px', fontSize: '12px', color: '#767676' }}>New to ShopZone?</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e7e7e7' }} />
        </div>

        <Link
          to={`/register${location.search}`}
          className="btn-amazon-secondary"
          style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: '600' }}
        >
          Create your ShopZone account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

