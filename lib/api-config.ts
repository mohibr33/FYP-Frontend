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
    console.error("API Error occurred:", error.message);
    console.error("Has response:", !!error.response);
    console.error("Has request:", !!error.request);
    console.error("Error code:", error.code);
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    
    if (error.request) {
      console.error("Network Error - No response received");
    }
    
    return Promise.reject(error);
  }
);
