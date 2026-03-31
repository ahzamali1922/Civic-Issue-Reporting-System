import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // <-- CHANGE THIS to localhost
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;