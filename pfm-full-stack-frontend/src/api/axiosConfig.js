import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';

const baseURL = isProduction 
  ? 'https://pfm-full-stack-api-faw777jkuq-rj.a.run.app'
  : 'http://localhost:8080';

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;