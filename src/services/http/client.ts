import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
apiClient.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
        config.headers.accesstoken = `${accessToken}`;
        config.headers.refreshtoken = `${refreshToken}`;
    }
    return config;
});

// Response interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;