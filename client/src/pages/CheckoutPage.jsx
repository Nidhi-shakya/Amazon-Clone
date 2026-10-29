import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  Lock,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ordersApi } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const { cartItems, totalItems, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { showToast } = useToast();

  // Selected address state
  const savedAddresses = user?.addresses || [];
  const defaultAddressIdx = savedAddresses.findIndex((a) => a.isDefault);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    defaultAddressIdx > -1 ? defaultAddressIdx : 0
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
          Your shopping cart is empty
        </h2>
        <p style={{ color: '#565959', marginBottom: '24px' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn-amazon-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  const handleAddNewAddressSubmit = async (e) => {
    e.preventDefault();
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      setErrorMessage('Please fill in all required shipping address fields');
      return;
    }

    if (newAddress.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (newAddress.postalCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code');
      return;
    }

    setErrorMessage('');
    const res = await addAddress(newAddress);
    if (res.success) {
      setShowNewAddressForm(false);
      setSelectedAddressIndex(res.addresses.length - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setErrorMessage('');
    let finalShippingAddress;

    if (showNewAddressForm) {
      if (
        !newAddress.fullName ||
        !newAddress.phone ||
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.postalCode
      ) {
        setErrorMessage('Please complete all fields for your delivery address');
        return;
      }
      finalShippingAddress = newAddress;
    } else {
      if (savedAddresses.length === 0) {
        setErrorMessage('Please provide a delivery address');
        setShowNewAddressForm(true);
        return;
      }
      finalShippingAddress = savedAddresses[selectedAddressIndex];
    }

    // Payment validation
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      setErrorMessage('Please provide a valid UPI ID (e.g. yourname@okhdfcbank)');
      return;
    }

    if (paymentMethod === 'Card') {
      if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
        setErrorMessage('Please enter a valid 16-digit card number');
        return;
      }
    }

    setLoading(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
        })),
        shippingAddress: finalShippingAddress,
        paymentMethod,
      };

      const res = await ordersApi.createOrder(orderPayload);

      if (res.success && res.data) {
        await clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.data._id}`, { state: { order: res.data } });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '90vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Simple checkout header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid #d5d9d9',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#131921' }}>
              Shop<span style={{ color: 'var(--amazon-gold)' }}>Zone</span>
            </span>
            <span style={{ fontSize: '13px', color: '#565959', marginLeft: '6px' }}>Checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#565959', fontSize: '13px' }}>
            <Lock size={16} />
            <span>100% Secure Checkout</span>
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#ffebee',
              border: '1px solid #ffcdd2',
              color: 'var(--amazon-red-deal)',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div
          className="checkout-layout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Checkout Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Delivery Address */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: 'var(--amazon-navy-dark)', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    1
                  </span>
                  Select Delivery Address
                </h2>
                {!showNewAddressForm && savedAddresses.length > 0 && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--amazon-blue-link)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '600',
                    }}
                  >
                    <Plus size={16} /> Add a new address
                  </button>
                )}
              </div>

              {/* Saved Addresses Radio List */}
              {!showNewAddressForm && savedAddresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedAddresses.map((addr, index) => {
                    const isSelected = selectedAddressIndex === index;
                    return (
                      <label
                        key={addr._id || index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                          backgroundColor: isSelected ? '#fefcf8' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => setSelectedAddressIndex(index)}
                          style={{ marginTop: '3px' }}
                        />
                        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          <div style={{ fontWeight: '700', color: '#0f1111' }}>
                            {addr.fullName} &bull; {addr.phone}
                          </div>
                          <div style={{ color: '#565959', marginTop: '2px' }}>
                            {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* New Address Form */
                <form onSubmit={handleAddNewAddressSubmit}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '14px',
                      fontSize: '13px',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                        Mobile Number (10 digits) *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                        Flat, House no., Building, Street, Area *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 301, Sunshine Heights, MG Road"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 560103"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="submit" className="btn-amazon-primary" style={{ padding: '8px 16px' }}>
                      Save &amp; Use Address
                    </button>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="btn-amazon-secondary"
                        style={{ padding: '8px 16px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: 'var(--amazon-navy-dark)', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  2
                </span>
                Select a Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Cash on Delivery */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '6px',
                    border: paymentMethod === 'COD' ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                    backgroundColor: paymentMethod === 'COD' ? '#fefcf8' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Banknote size={18} color="var(--amazon-green-stock)" />
                      Cash on Delivery / Pay on Delivery
                    </div>
                    <span style={{ fontSize: '12px', color: '#565959' }}>
                      Pay using cash or UPI at the time of delivery. No extra fee.
                    </span>
                  </div>
                </label>

                {/* UPI */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '6px',
                    border: paymentMethod === 'UPI' ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                    backgroundColor: paymentMethod === 'UPI' ? '#fefcf8' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    style={{ marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <QrCode size={18} color="var(--amazon-blue-link)" />
                      UPI (Google Pay, PhonePe, Paytm, BHIM)
                    </div>
                    <span style={{ fontSize: '12px', color: '#565959' }}>
                      Instant payment using any UPI app.
                    </span>

                    {paymentMethod === 'UPI' && (
                      <div style={{ marginTop: '10px' }}>
                        <input
                          type="text"
                          placeholder="Enter your UPI ID (e.g. rahul@okaxis)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          style={{
                            width: '100%',
                            maxWidth: '320px',
                            padding: '8px',
                            border: '1px solid #d5d9d9',
                            borderRadius: '4px',
                            fontSize: '13px',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* Credit / Debit Card (Mock) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '6px',
                    border: paymentMethod === 'Card' ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                    backgroundColor: paymentMethod === 'Card' ? '#fefcf8' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    style={{ marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CreditCard size={18} color="#0f1111" />
                      Credit or Debit Card (Mock Demonstration)
                    </div>
                    <span style={{ fontSize: '12px', color: '#565959' }}>
                      Visa, MasterCard, RuPay, Maestro. (No real money is charged)
                    </span>

                    {paymentMethod === 'Card' && (
                      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '380px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Net Banking */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '6px',
                    border: paymentMethod === 'NetBanking' ? '2px solid var(--amazon-orange)' : '1px solid #d5d9d9',
                    backgroundColor: paymentMethod === 'NetBanking' ? '#fefcf8' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="NetBanking"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={() => setPaymentMethod('NetBanking')}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={18} color="#0f1111" />
                      Net Banking
                    </div>
                    <span style={{ fontSize: '12px', color: '#565959' }}>
                      All Indian banks supported (HDFC, SBI, ICICI, Axis, etc.)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Review Items */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ backgroundColor: 'var(--amazon-navy-dark)', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  3
                </span>
                Review Items and Delivery
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => {
                  const p = item.product || item;
                  return (
                    <div
                      key={p._id || item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.images?.[0] || 'https://via.placeholder.com/60'}
                          alt={p.name}
                          style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #e7e7e7', borderRadius: '4px' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: '#0f1111', maxWidth: '380px' }}>
                            {p.name}
                          </div>
                          <div style={{ color: '#565959', fontSize: '12px' }}>
                            Quantity: {item.quantity} &bull; Delivery: FREE (Standard)
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: '700', color: '#0f1111' }}>
                        ₹{((p.price || item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
              position: 'sticky',
              top: '80px',
            }}
          >
            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-amazon-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '12px',
              }}
            >
              {loading ? 'Processing Order...' : 'Place your order'}
            </button>

            <p style={{ fontSize: '11px', color: '#565959', textAlign: 'center', marginBottom: '16px' }}>
              By placing your order, you agree to ShopZone's Conditions of Use &amp; Sale.
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#565959' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items ({totalItems}):</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery:</span>
                <span style={{ color: deliveryCharge === 0 ? 'var(--amazon-green-stock)' : '#0f1111', fontWeight: '600' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Promotion:</span>
                <span style={{ color: 'var(--amazon-green-stock)' }}>-₹0</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', margin: '14px 0' }} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--amazon-red-deal)',
                marginBottom: '16px',
              }}
            >
              <span>Order Total:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#565959',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="var(--amazon-green-stock)" />
              <span>Safe and secure payments. 100% genuine products.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
