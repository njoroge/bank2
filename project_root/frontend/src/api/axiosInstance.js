import axios from 'axios';

// Ensure API calls are relative to the domain Django is serving from.
const API_BASE_URL = '/api'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or get from AuthContext if preferred
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling or token refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Example: Handle 401 Unauthorized globally (e.g., redirect to login)
    if (error.response && error.response.status === 401) {
      // This could be where you trigger a logout from AuthContext
      // For now, just logging it.
      console.error('Unauthorized. Token might be invalid or expired.');
      // localStorage.removeItem('token'); // Consider clearing token
      // window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
