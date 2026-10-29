import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();

  const order = location.state?.order;

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '36px',
            boxShadow: 'var(--shadow-card)',
            borderTop: '6px solid var(--amazon-green-stock)',
          }}
        >
          {/* Success Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <CheckCircle2 size={36} color="var(--amazon-green-stock)" />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f1111', lineHeight: '1.2' }}>
                Order Placed, thanks!
              </h1>
              <span style={{ fontSize: '13px', color: '#565959' }}>
                Confirmation has been sent to <strong>{user?.email || 'your registered email address'}</strong>
              </span>
            </div>
          </div>

          {/* Order Details Card */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              padding: '18px 20px',
              margin: '20px 0',
              border: '1px solid #e7e7e7',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#565959', display: 'block', marginBottom: '2px' }}>Order Number:</span>
                <strong style={{ fontSize: '15px', color: '#0f1111' }}>
                  {order?.orderNumber || id || 'SZ-2026-DEL9910'}
                </strong>
              </div>

              <div>
                <span style={{ color: '#565959', display: 'block', marginBottom: '2px' }}>Estimated Delivery:</span>
                <strong style={{ fontSize: '14px', color: 'var(--amazon-green-stock)' }}>
                  {order?.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Within 2-3 business days'}
                </strong>
              </div>

              <div>
                <span style={{ color: '#565959', display: 'block', marginBottom: '2px' }}>Payment Method:</span>
                <strong style={{ fontSize: '14px', color: '#0f1111' }}>
                  {order?.paymentMethod || 'COD'}
                </strong>
              </div>

              <div>
                <span style={{ color: '#565959', display: 'block', marginBottom: '2px' }}>Order Total:</span>
                <strong style={{ fontSize: '16px', color: 'var(--amazon-red-deal)' }}>
                  ₹{(order?.totalPrice || 0).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {order?.shippingAddress && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #d5d9d9', fontSize: '13px' }}>
                <span style={{ color: '#565959' }}>Shipping Address: </span>
                <strong>
                  {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </strong>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
            <Link to="/orders" className="btn-amazon-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              <Package size={16} /> View Order History
            </Link>
            <Link to="/products" className="btn-amazon-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              <Home size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

