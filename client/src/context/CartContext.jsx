import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const FREE_DELIVERY_THRESHOLD = 499;

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to calculate totals
  const calculateTotals = (currentItems) => {
    let subtotal = 0;
    let totalItems = 0;

    currentItems.forEach((item) => {
      const p = item.product || item;
      const price = p.price || item.price || 0;
      const qty = item.quantity || 1;
      subtotal += price * qty;
      totalItems += qty;
    });

    const isEligibleForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryCharge = subtotal === 0 || isEligibleForFreeDelivery ? 0 : 40;
    const total = subtotal + deliveryCharge;
    const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

    return {
      subtotal: Math.round(subtotal),
      totalItems,
      isEligibleForFreeDelivery,
      deliveryCharge,
      total: Math.round(total),
      amountNeededForFreeDelivery: Math.round(amountNeededForFreeDelivery),
    };
  };

  // Fetch cart from backend if authenticated, or load from localStorage for guests
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await cartApi.getCart();
        if (res.success && res.data) {
          setItems(res.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load server cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = localStorage.getItem('shopzone_guest_cart');
      if (guestCart) {
        try {
          setItems(JSON.parse(guestCart));
        } catch {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart, token]);

  // Save guest cart to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shopzone_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (isAuthenticated) {
      try {
        const res = await cartApi.addToCart(product._id, qty);
        if (res.success) {
          setItems(res.data.items);
          showToast(`Added "${product.name.slice(0, 30)}..." to Cart`, 'success');
          return true;
        }
      } catch (err) {
        showToast(err.message, 'error');
        return false;
      }
    } else {
      // Guest cart handler
      setItems((prev) => {
        const existingIdx = prev.findIndex(
          (it) => (it.product?._id || it.product) === product._id
        );
        let updated;
        if (existingIdx > -1) {
          updated = [...prev];
          const newQty = updated[existingIdx].quantity + qty;
          if (newQty > product.countInStock) {
            showToast(`Only ${product.countInStock} items available in stock`, 'error');
            return prev;
          }
          updated[existingIdx].quantity = newQty;
        } else {
          updated = [
            ...prev,
            {
              product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                mrp: product.mrp,
                images: product.images,
                countInStock: product.countInStock,
                isPrime: product.isPrime,
                brand: product.brand,
              },
              quantity: qty,
              price: product.price,
            },
          ];
        }
        showToast(`Added "${product.name.slice(0, 30)}..." to Cart`, 'success');
        return updated;
      });
      return true;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty < 1) return removeFromCart(productId);

    if (isAuthenticated) {
      try {
        const res = await cartApi.updateCartItem(productId, qty);
        if (res.success) {
          setItems(res.data.items);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setItems((prev) =>
        prev.map((it) => {
          const id = it.product?._id || it.product;
          if (id === productId) {
            return { ...it, quantity: qty };
          }
          return it;
        })
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await cartApi.removeFromCart(productId);
        if (res.success) {
          setItems(res.data.items);
          showToast('Item removed from cart', 'info');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setItems((prev) =>
        prev.filter((it) => (it.product?._id || it.product) !== productId)
      );
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        setItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setItems([]);
      localStorage.removeItem('shopzone_guest_cart');
    }
  };

  const totals = calculateTotals(items);

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items,
        loading,
        totalItems: totals.totalItems,
        subtotal: totals.subtotal,
        deliveryCharge: totals.deliveryCharge,
        total: totals.total,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery: totals.amountNeededForFreeDelivery,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

