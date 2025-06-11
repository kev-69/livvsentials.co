import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/admin';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'appilcation/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');

        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }

        return config
    }, 
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken')
        }
        return Promise.reject(error)
    }
)

export default apiClient;