import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopzone_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  addAddress: (addressData) => api.post('/auth/address', addressData),
};

export const productsApi = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getFeaturedDeals: () => api.get('/products/deals/featured'),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) =>
    api.post('/cart/items', { productId, quantity }),
  updateCartItem: (productId, quantity) =>
    api.patch(`/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) =>
    api.post('/wishlist/toggle', { productId }),
  removeFromWishlist: (productId) =>
    api.delete(`/wishlist/items/${productId}`),
};

export const ordersApi = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export default api;

