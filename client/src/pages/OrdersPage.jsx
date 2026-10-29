import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersApi.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" />
        <p style={{ marginTop: '12px', color: '#565959' }}>Retrieving your order history...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '85vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#565959', marginBottom: '14px' }}>
          <Link to="/account" style={{ color: 'var(--amazon-blue-link)' }}>Your Account</Link>
          <span style={{ margin: '0 6px' }}>&rsaquo;</span>
          <span style={{ color: '#0f1111', fontWeight: '500' }}>Your Orders</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f1111', marginBottom: '16px' }}>
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed #d5d9d9',
              marginTop: '20px',
            }}
          >
            <Package size={48} color="#888888" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              No orders placed yet
            </h3>
            <p style={{ color: '#565959', fontSize: '14px', marginBottom: '20px' }}>
              Looks like you haven't placed an order yet. Check out today's top deals!
            </p>
            <Link to="/products?isDeal=true" className="btn-amazon-primary" style={{ padding: '10px 24px' }}>
              Explore Today's Deals
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <div
                  key={order._id}
                  style={{
                    border: '1px solid #d5d9d9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Order Top Strip Header */}
                  <div
                    style={{
                      backgroundColor: '#f0f2f2',
                      padding: '14px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#565959',
                      borderBottom: '1px solid #d5d9d9',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                          Order Placed
                        </span>
                        <strong style={{ color: '#0f1111', fontSize: '13px' }}>{orderDate}</strong>
                      </div>

                      <div>
                        <span style={{ display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                          Total
                        </span>
                        <strong style={{ color: '#0f1111', fontSize: '13px' }}>
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <div>
                        <span style={{ display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                          Ship To
                        </span>
                        <strong style={{ color: 'var(--amazon-blue-link)', fontSize: '13px' }}>
                          {order.shippingAddress?.fullName || 'Rahul Sharma'}
                        </strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
                        Order # {order.orderNumber}
                      </span>
                      <Link
                        to={`/orders/${order._id}`}
                        style={{ color: 'var(--amazon-blue-link)', fontSize: '12px', fontWeight: '600' }}
                      >
                        View order details
                      </Link>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div style={{ padding: '20px' }}>
                    {/* Status headline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      {order.status === 'Delivered' ? (
                        <>
                          <CheckCircle2 size={18} color="var(--amazon-green-stock)" />
                          <strong style={{ fontSize: '16px', color: 'var(--amazon-green-stock)' }}>
                            Delivered
                          </strong>
                        </>
                      ) : (
                        <>
                          <Truck size={18} color="var(--amazon-orange)" />
                          <strong style={{ fontSize: '16px', color: '#0f1111' }}>
                            {order.status} &bull; Expected by{' '}
                            {order.estimatedDelivery
                              ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'soon'}
                          </strong>
                        </>
                      )}
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {order.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link
                              to={`/product/${item.product?._id || item.product}`}
                              style={{
                                width: '80px',
                                height: '80px',
                                border: '1px solid #e7e7e7',
                                borderRadius: '4px',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={item.image || 'https://via.placeholder.com/80'}
                                alt={item.name}
                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                              />
                            </Link>

                            <div>
                              <Link
                                to={`/product/${item.product?._id || item.product}`}
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: 'var(--amazon-blue-link)',
                                  lineHeight: '1.3',
                                  display: 'block',
                                  marginBottom: '4px',
                                  maxWidth: '460px',
                                }}
                              >
                                {item.name}
                              </Link>
                              <div style={{ fontSize: '13px', color: '#565959' }}>
                                Qty: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')} each
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                            <button
                              onClick={() => {
                                addToCart(item.product || { _id: item.product, name: item.name, price: item.price, images: [item.image] }, 1);
                              }}
                              className="btn-amazon-primary"
                              style={{ width: '100%', padding: '7px 12px', fontSize: '12px' }}
                            >
                              <ShoppingBag size={14} /> Buy it again
                            </button>
                            <Link
                              to={`/orders/${order._id}`}
                              className="btn-amazon-secondary"
                              style={{ width: '100%', padding: '6px 12px', fontSize: '12px', textAlign: 'center' }}
                            >
                              Track package
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

