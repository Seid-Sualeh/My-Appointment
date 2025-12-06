// // import axios from "axios";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// // // Create axios instance with default config
// // const api = axios.create({
// //   baseURL: API_URL,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // // Request interceptor to add auth token
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // // Response interceptor to handle auth errors
// // api.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       localStorage.removeItem("token");
// //       localStorage.removeItem("user");
// //       window.location.href = "/login";
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // // Auth service methods
// // export const authService = {
// //   // Register new user
// //   register: async (userData) => {
// //     const response = await api.post("/auth/register", userData);
// //     return response.data;
// //   },

// //   // Login user
// //   login: async (credentials) => {
// //     const response = await api.post("/auth/login", credentials);
// //     const { token, user } = response.data;

// //     localStorage.setItem("token", token);
// //     localStorage.setItem("user", JSON.stringify(user));

// //     return response.data;
// //   },

// //   // Logout user
// //   logout: async () => {
// //     try {
// //       await api.post("/auth/logout");
// //     } catch (error) {
// //       // Continue with logout even if API call fails
// //       console.warn("Logout API call failed:", error);
// //     }

// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //   },

// //   // Get current user
// //   getCurrentUser: async () => {
// //     const response = await api.get("/auth/me");
// //     return response.data;
// //   },

// //   // Update user profile
// //   updateProfile: async (profileData) => {
// //     const response = await api.put("/auth/me", profileData);
// //     const { user } = response.data;

// //     localStorage.setItem("user", JSON.stringify(user));
// //     return response.data;
// //   },

// //   // Change password
// //   changePassword: async (passwordData) => {
// //     const response = await api.put("/auth/password", passwordData);
// //     return response.data;
// //   },

// //   // Forgot password
// //   forgotPassword: async (email) => {
// //     const response = await api.post("/auth/forgotpassword", { email });
// //     return response.data;
// //   },

// //   // Reset password
// //   resetPassword: async (token, password) => {
// //     const response = await api.put(`/auth/resetpassword/${token}`, {
// //       password,
// //     });
// //     return response.data;
// //   },

// //   // Verify email
// //   verifyEmail: async (token) => {
// //     const response = await api.get(`/auth/verify-email/${token}`);
// //     return response.data;
// //   },

// //   // Resend verification email
// //   resendVerification: async () => {
// //     const response = await api.post("/auth/resend-verification");
// //     return response.data;
// //   },

// //   // Update notification preferences
// //   updateNotificationPreferences: async (preferences) => {
// //     const response = await api.put(
// //       "/auth/notification-preferences",
// //       preferences
// //     );
// //     const { user } = response.data;

// //     localStorage.setItem("user", JSON.stringify(user));
// //     return response.data;
// //   },

// //   // Delete account
// //   deleteAccount: async () => {
// //     const response = await api.delete("/auth/account");
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     return response.data;
// //   },

// //   // Refresh token
// //   refreshToken: async () => {
// //     const response = await api.post("/auth/refresh");
// //     const { token } = response.data;

// //     localStorage.setItem("token", token);
// //     return response.data;
// //   },

// //   // Check if user is authenticated
// //   isAuthenticated: () => {
// //     const token = localStorage.getItem("token");
// //     return !!token;
// //   },

// //   // Get stored user data
// //   getStoredUser: () => {
// //     const userStr = localStorage.getItem("user");
// //     return userStr ? JSON.parse(userStr) : null;
// //   },

// //   // Social login
// //   socialLogin: async (provider, userData) => {
// //     const response = await api.post("/auth/social-login", {
// //       provider,
// //       userData,
// //     });

// //     const { token, user } = response.data;
// //     localStorage.setItem("token", token);
// //     localStorage.setItem("user", JSON.stringify(user));

// //     return response.data;
// //   },

// //   // Check token validity
// //   validateToken: async () => {
// //     try {
// //       const response = await api.get("/auth/me");
// //       return { valid: true, user: response.data.user };
// //     } catch (error) {
// //       return { valid: false, error: error.message };
// //     }
// //   },
// // };

// // export default authService;

// import api from "./api";

// export const authService = {
//   login: async (email, password) => {
//     const response = await api.post("/auth/login", { email, password });
//     return response.data;
//   },

//   register: async (userData) => {
//     const response = await api.post("/auth/register", userData);
//     return response.data;
//   },

//   getCurrentUser: async () => {
//     const response = await api.get("/auth/me");
//     return response.data;
//   },

//   updateProfile: async (userData) => {
//     const response = await api.put("/auth/me", userData);
//     return response.data;
//   },

//   socialLogin: async (provider) => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
//   },
// };

import axios from "axios";

// Use environment variable for API URL
// NOTE: I'm using VITE_API_URL or REACT_APP_API_URL based on the context,
// defaulting to a common local host address.
const API_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor to Add Auth Token ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor to Handle Auth Errors (401) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get an Unauthorized response, clear credentials and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use window.location.href to force a page reload and state reset
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- Auth Service Methods ---
export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    // Ensuring 'credentials' is passed as expected (e.g., { email, password })
    const response = await api.post("/auth/login", credentials);
    const { token, user } = response.data;

    // Store token and user data upon successful login
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      // Optional: Hit a logout endpoint to clear server-side session/cookie if applicable
      await api.post("/auth/logout");
    } catch (error) {
      console.warn(
        "Logout API call failed, but clearing local storage:",
        error
      );
    }

    // Always clear local storage credentials
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user (Used for validation and initial state setup)
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/auth/me", profileData); // Using /auth/me or /auth/profile, unifying to /auth/me for consistency
    const { user } = response.data;

    // Update local user data upon successful profile update
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/auth/password", passwordData);
    return response.data;
  },

  // Forgot password - Unified to kebab-case
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password - Unified to kebab-case and using PUT (from first snippet)
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verifyemail/${token}`);
    // Optional: After successful verification, you might refresh user data in localStorage
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    // Adding 'email' argument for better API implementation
    const data = email ? { email } : {};
    const response = await api.post("/auth/resendverification", data);
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put(
      "/auth/notification-preferences",
      preferences
    );
    const { user } = response.data;

    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete("/auth/account");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    const { token } = response.data;

    localStorage.setItem("token", token);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Social login (for API-driven token exchange)
  socialLogin: async (provider, userData) => {
    try {
      const response = await api.post("/auth/social-login", {
        provider,
        userData,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error(`Social login (${provider}) failed:`, error);
      throw error;
    }
  },

  // Social login (for redirect flow)
  // NOTE: This assumes a backend redirect is handled by the server
  socialLoginRedirect: (provider) => {
    try {
      const socialAuthUrl = `${API_URL}/auth/${provider}`;
      console.log(
        `Initiating ${provider} social login redirect to: ${socialAuthUrl}`
      );
      window.location.href = socialAuthUrl;
    } catch (error) {
      console.error(`Failed to initiate ${provider} social login:`, error);
      throw error;
    }
  },

  // Firebase social login (client-side alternative)
  firebaseSocialLogin: async (provider) => {
    try {
      let result;
      if (provider === "google") {
        const { signInWithGoogle } = await import("../firebaseConfig");
        result = await signInWithGoogle();
      } else if (provider === "facebook") {
        const { signInWithFacebook } = await import("../firebaseConfig");
        result = await signInWithFacebook();
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      if (!result.success) {
        throw new Error(
          result.error || `Failed to authenticate with ${provider}`
        );
      }

      // Exchange Firebase credential for our backend token
      const exchangeResponse = await api.post("/auth/firebase-social-login", {
        provider,
        firebaseToken: result.credential?.accessToken,
        userData: result.user,
      });

      const { token, user } = exchangeResponse.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return exchangeResponse.data;
    } catch (error) {
      console.error(`Firebase social login (${provider}) failed:`, error);
      throw error;
    }
  },

  // Check token validity
  validateToken: async () => {
    try {
      // Re-using getCurrentUser endpoint to check token validity
      const response = await authService.getCurrentUser();
      return { valid: true, user: response.user };
    } catch (error) {
      // Interceptor handles the 401, but we catch other errors here
      return { valid: false, error: error.message };
    }
  },
};

export default authService;
