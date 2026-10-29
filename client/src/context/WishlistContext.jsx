import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await wishlistApi.getWishlist();
        if (res.success && res.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const guestWishlist = localStorage.getItem('shopzone_guest_wishlist');
      if (guestWishlist) {
        try {
          setItems(JSON.parse(guestWishlist));
        } catch {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shopzone_guest_wishlist', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const isInWishlist = (productId) => {
    return items.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await wishlistApi.toggleWishlist(productId);
        if (res.success) {
          setItems(res.data);
          showToast(res.message, res.isWishlisted ? 'success' : 'info');
          return res.isWishlisted;
        }
      } catch (err) {
        showToast(err.message, 'error');
        return false;
      }
    } else {
      let isAdded = false;
      setItems((prev) => {
        const exists = prev.some((p) => p._id === productId);
        if (exists) {
          isAdded = false;
          showToast('Removed from Wishlist', 'info');
          return prev.filter((p) => p._id !== productId);
        } else {
          isAdded = true;
          showToast('Added to Wishlist', 'success');
          return [...prev, product];
        }
      });
      return isAdded;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistApi.removeFromWishlist(productId);
        if (res.success) {
          setItems(res.data);
          showToast('Item removed from Wishlist', 'info');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setItems((prev) => prev.filter((p) => p._id !== productId));
      showToast('Item removed from Wishlist', 'info');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: items,
        wishlistCount: items.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

