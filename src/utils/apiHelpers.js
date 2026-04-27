import axios from 'axios';

/**
 * Global Axios instance configured with central error interceptors.
 */
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Global API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
