import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const apiUrl = process.env.API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

export default axiosInstance;
