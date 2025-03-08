import axios from 'axios';

// Create an axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dogapp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('dogapp_token', response.data.token);
      localStorage.setItem('dogapp_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (userData: { email: string; password: string }) => {
    const response = await api.post('/users/login', userData);
    if (response.data.token) {
      localStorage.setItem('dogapp_token', response.data.token);
      localStorage.setItem('dogapp_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('dogapp_token');
    localStorage.removeItem('dogapp_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('dogapp_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Incident services
export const incidentService = {
  getIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },

  getIncidentById: async (id: string) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  createIncident: async (incidentData: any) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  markHelpful: async (id: string) => {
    const response = await api.post(`/incidents/${id}/helpful`);
    return response.data;
  },

  // Admin functions
  getAllIncidents: async () => {
    const response = await api.get('/incidents/admin/all');
    return response.data;
  },

  updateIncidentStatus: async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const response = await api.patch(`/incidents/${id}/status`, { status });
    return response.data;
  },

  deleteIncident: async (id: string) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  },
};

export default api; 