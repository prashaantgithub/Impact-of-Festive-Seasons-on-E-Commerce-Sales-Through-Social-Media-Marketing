import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dataService = {
  seedDatabase: async () => {
    const response = await apiClient.post('/seed');
    return response.data;
  },

  getFestivals: async () => {
    const response = await apiClient.get('/festivals');
    return response.data;
  },

  getSummary: async (params) => {
    const response = await apiClient.get('/summary', { params });
    return response.data;
  },

  getTimeline: async (params) => {
    const response = await apiClient.get('/timeline', { params });
    return response.data;
  },

  getSocialBreakdown: async (params) => {
    const response = await apiClient.get('/social-breakdown', { params });
    return response.data;
  },

  getLagAnalysis: async (lag) => {
    const response = await apiClient.get('/lag-analysis', { params: { lag } });
    return response.data;
  },

  getCounterfactual: async (params) => {
    const response = await apiClient.get('/counterfactual', { params });
    return response.data;
  },
};

export default dataService;