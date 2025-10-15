import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const buildsAPI = {
  listBuilds: () => api.get('/builds'),
  startBuild: (data) => api.post('/builds/start', data),
  getBuild: (id) => api.get(`/builds/${id}`),
  autoFix: (id) => api.post(`/builds/${id}/auto-fix`),
};

export default api;