import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
});

// Set default Content-Type for JSON requests only
api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';
api.defaults.headers.patch['Content-Type'] = 'application/json';

// Intercept requests to remove Content-Type header for FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let browser set Content-Type with proper boundary for multipart/form-data
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;