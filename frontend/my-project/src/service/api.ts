import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const API_URL = "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true, // Important for cookie-based auth
});

// Request Interceptor: Attach Token & Logging
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    console.log(`🌐 [API] ${config.method?.toUpperCase()} ${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 [API] Authenticated request`);
    }

    if (config.data) {
      console.log(`📤 [API] Request data:`, config.data);
    }

    return config;
  },
  (error) => {
    console.error("❌ [API] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`
    );
    console.log(`📥 [API] Response data:`, response.data);
    return response;
  },
  async (error) => {
    console.error(
      `❌ [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error:`,
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      }
    );

    const status = error.response?.status;

    // Handle 401 Unauthorized - Auto logout
    if (status === 401) {
      const authState = useAuthStore.getState();
      if (authState.isAuthenticated) {
        console.warn("⚠️ [API] Unauthorized (401)! Auto-logging out user...");
        authState.logout();
        // Redirect will be handled by the auth guard
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API METHODS
// ============================================
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  refreshToken: () => api.post("/auth/refresh-token"),

  getCurrentUser: () => api.get("/auth/me"),
};

// ============================================
// PROFILE API METHODS
// ============================================
export const profileApi = {
  getProfile: () => api.get("/auth/me"),

  updateProfile: (data: Partial<{
    name: string;
    email: string;
    businessName: string;
    phone: string;
  }>) => api.patch("/auth/me", data),
};

export default api;

