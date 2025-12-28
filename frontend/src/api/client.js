import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

// Helper to extract error message
const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.error || error.response.data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response (network error)
    return 'Network error: Could not connect to server. Make sure the backend is running.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Wrapper functions with error handling
export const get = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const post = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const put = async (url, data) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};
