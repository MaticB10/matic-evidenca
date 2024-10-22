import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const cookieApiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
});

export default cookieApiClient;