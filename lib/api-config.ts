import axios from "axios";

export const API_BASE_URL = "http://localhost:5050";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 360000, // 6 minutes - for AI meal plan generation
});

// Request interceptor for adding auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add token from localStorage if exists
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log full error for debugging
    console.log("Full error object:", JSON.stringify(error, null, 2));
    
    if (error.response && typeof error.response === 'object' && Object.keys(error.response).length > 0) {
      // Server responded with error
      const responseData = error.response.data;
      const errorInfo: any = {};
      
      if (error.response.status !== undefined) {
        errorInfo.status = error.response.status;
      }
      
      if (error.response.statusText) {
        errorInfo.statusText = error.response.statusText;
      }
      
      if (error.config?.url) {
        errorInfo.url = error.config.url;
      }
      
      if (responseData !== undefined && responseData !== null) {
        errorInfo.data = responseData;
      }
      
      console.error("API Error:", errorInfo);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
      console.error("Request config:", error.config);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
