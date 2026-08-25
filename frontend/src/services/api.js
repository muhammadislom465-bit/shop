import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uzum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid
      if (localStorage.getItem('uzum_token')) {
        localStorage.removeItem('uzum_token');
        localStorage.removeItem('uzum_user');
        window.dispatchEvent(new Event('auth-changed'));
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const ordersApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getAllOrders: () => api.get('/orders'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const newsApi = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
  getTemplates: () => api.get('/news/templates/list'),
  createTemplate: (data) => api.post('/news/templates', data),
  applyTemplate: (id, customTitle) => api.post(`/news/apply-template/${id}`, null, {
    params: customTitle ? { custom_title: customTitle } : {}
  }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getSecurityLogs: (limit = 50) => api.get('/admin/security-logs', { params: { limit } }),
  getUsers: () => api.get('/admin/users'),
};

export const reviewsApi = {
  getProductReviews: (productId, sortBy = 'newest', skip = 0, limit = 20) =>
    api.get(`/reviews/product/${productId}`, { params: { sort_by: sortBy, skip, limit } }),
  getProductStats: (productId) => api.get(`/reviews/product/${productId}/stats`),
  create: (data) => api.post('/reviews', data),
  markHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful`),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getMyReviews: () => api.get('/reviews/my'),
};

export const couponsApi = {
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  validate: (data) => api.post('/coupons/validate', data),
  apply: (code) => api.post(`/coupons/apply/${code}`),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const wishlistApi = {
  getMyWishlist: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  clear: () => api.delete('/wishlist'),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.post('/profile/change-password', data),
  getStats: () => api.get('/profile/stats'),
  getAddresses: () => api.get('/profile/addresses'),
  createAddress: (data) => api.post('/profile/addresses', data),
  updateAddress: (id, data) => api.put(`/profile/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/profile/addresses/${id}`),
  getMyReviews: () => api.get('/reviews/my'),
};

export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTopViewed: (limit = 10) => api.get('/analytics/products/top-viewed', { params: { limit } }),
  getLowStock: (threshold = 10) => api.get('/analytics/products/low-stock', { params: { threshold } }),
  getCategoryRevenue: () => api.get('/analytics/categories/revenue'),
  getUserStats: () => api.get('/analytics/users/stats'),
  getSecuritySummary: () => api.get('/analytics/security/summary'),
};

export const contentApi = {
  getFAQs: (category) => api.get('/content/faq', { params: category ? { category } : {} }),
  getFAQCategories: () => api.get('/content/faq/categories'),
  createFAQ: (data) => api.post('/content/faq', data),
  updateFAQ: (id, data) => api.put(`/content/faq/${id}`, data),
  deleteFAQ: (id) => api.delete(`/content/faq/${id}`),
  getBanners: (activeOnly = true) => api.get('/content/banners', { params: { active_only: activeOnly } }),
  createBanner: (data) => api.post('/content/banners', data),
  updateBanner: (id, data) => api.put(`/content/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/content/banners/${id}`),
};

export const pvzApi = {
  getAll: (params) => api.get('/pvz', { params }),
  getById: (id) => api.get(`/pvz/${id}`),
};

export const brandsApi = {
  getAll: (params) => api.get('/brands', { params }),
  getById: (id) => api.get(`/brands/${id}`),
};

export const warrantyApi = {
  createClaim: (data) => api.post('/warranty/claims', data),
  getMyClaims: () => api.get('/warranty/claims/my'),
  getClaimById: (id) => api.get(`/warranty/claims/${id}`),
};

export const sellerApi = {
  submitApplication: (data) => api.post('/seller/apply', data),
  getStatus: () => api.get('/seller/status'),
};

export const chatApi = {
  sendMessage: (data) => api.post('/chat/messages', data),
  getHistory: () => api.get('/chat/history'),
  getFAQBots: () => api.get('/chat/faq'),
};

export default api;
