import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Логирование запросов
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Логирование ответов
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);

    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - logging out user');
      localStorage.removeItem('authToken');
      // Reload page to reset auth state
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
