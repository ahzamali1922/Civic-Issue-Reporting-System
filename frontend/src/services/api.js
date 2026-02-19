import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Matches your Django local server
  withCredentials: true, // CRITICAL: This sends the session cookie to Django
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;