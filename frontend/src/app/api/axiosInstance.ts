// utils/axiosInstance.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
