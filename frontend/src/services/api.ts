import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  setToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/clients', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

export const invoiceService = {
  getAll: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/invoices/stats');
    return response.data;
  },
  sendEmail: async (id: number) => {
    const response = await api.post(`/invoices/${id}/send-email`);
    return response.data;
  },
};

export const stripeService = {
  createCheckoutSession: async (invoiceId: number) => {
    const response = await api.post('/stripe/create-checkout-session', { invoiceId });
    return response.data;
  },
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const authPublicService = {
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

export const publicInvoiceService = {
  getInvoice: async (invoiceId: number) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/pay/invoice/${invoiceId}`);
    return response.data;
  },
  createCheckoutSession: async (invoiceId: number) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/pay/invoice/${invoiceId}/pay`);
    return response.data;
  },
};

export default api;

