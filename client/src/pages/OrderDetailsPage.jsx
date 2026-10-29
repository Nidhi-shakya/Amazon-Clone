import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, Printer } from 'lucide-react';
import { ordersApi } from '../services/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await ordersApi.getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" />
        <p style={{ marginTop: '12px', color: '#565959' }}>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
          {error || 'Order not found'}
        </h2>
        <Link to="/orders" className="btn-amazon-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status) > -1 ? steps.indexOf(order.status) : (order.isDelivered ? 3 : 1);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '85vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: '#565959' }}>
            <Link to="/orders" style={{ color: 'var(--amazon-blue-link)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} /> Back to Your Orders
            </Link>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--amazon-blue-link)',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={16} /> Print invoice
          </button>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f1111', marginBottom: '8px' }}>
          Order Details
        </h1>
        <div style={{ fontSize: '13px', color: '#565959', marginBottom: '20px' }}>
          Ordered on {orderDate} &bull; Order # {order.orderNumber}
        </div>

        {/* Tracking Timeline Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px' }}>
            Package Tracking: {order.status}
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              maxWidth: '640px',
              margin: '0 auto 16px',
            }}
          >
            {/* Connecting bar */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '20px',
                right: '20px',
                height: '4px',
                backgroundColor: '#e7e7e7',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                  backgroundColor: 'var(--amazon-green-stock)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            {/* Steps circles */}
            {steps.map((st, i) => {
              const isCompleted = i <= currentStepIdx;
              return (
                <div
                  key={st}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--amazon-green-stock)' : '#ffffff',
                      border: isCompleted ? '2px solid var(--amazon-green-stock)' : '2px solid #d5d9d9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? '#ffffff' : '#565959',
                      fontWeight: '700',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isCompleted ? '700' : '400',
                      color: isCompleted ? '#0f1111' : '#767676',
                      textAlign: 'center',
                    }}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-Column Shipping, Payment, and Summary Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            fontSize: '13px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
              Shipping Address
            </h3>
            <div style={{ color: '#565959', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '600', color: '#0f1111' }}>
                {order.shippingAddress.fullName}
              </div>
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
              <div>{order.shippingAddress.country}</div>
              <div style={{ marginTop: '4px' }}>Phone: {order.shippingAddress.phone}</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
              Payment Method
            </h3>
            <div style={{ color: '#565959', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '600', color: '#0f1111' }}>
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
              </div>
              <div>Status: {order.isPaid ? 'Paid' : 'Pending payment upon delivery'}</div>
              {order.paymentResult?.reference && (
                <div style={{ fontSize: '11px', marginTop: '4px' }}>
                  Ref: {order.paymentResult.reference}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111' }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#565959' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Item(s) Subtotal:</span>
                <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping &amp; Handling:</span>
                <span>{order.deliveryPrice === 0 ? 'FREE' : `₹${order.deliveryPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#0f1111', paddingTop: '6px', borderTop: '1px solid #e7e7e7', marginTop: '4px' }}>
                <span>Grand Total:</span>
                <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            Items Ordered
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.orderItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: idx === order.orderItems.length - 1 ? 'none' : '1px solid #e7e7e7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', objectFit: 'contain', border: '1px solid #e7e7e7', borderRadius: '4px', padding: '4px' }}
                  />
                  <div>
                    <Link
                      to={`/product/${item.product?._id || item.product}`}
                      style={{ fontSize: '14px', fontWeight: '600', color: 'var(--amazon-blue-link)', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
                    >
                      {item.name}
                    </Link>
                    <div style={{ fontSize: '12px', color: '#565959' }}>
                      Quantity: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')} each
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f1111' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

