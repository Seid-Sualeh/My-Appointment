import api from "./api";

export const aiAssistantService = {
  // Send message to AI assistant
  sendMessage: async (message, context = {}) => {
    try {
      const response = await api.post("/ai/chat", {
        message,
        context,
      });
      return response.data;
    } catch (error) {
      console.error("AI Assistant Error:", error);
      throw error;
    }
  },

  // Get quick actions based on user context
  getQuickActions: async () => {
    try {
      const response = await api.get("/ai/quick-actions");
      return response.data;
    } catch (error) {
      console.error("Quick Actions Error:", error);
      return {
        success: false,
        actions: [],
      };
    }
  },

  // Get step-by-step guide
  getGuide: async (task, context = {}) => {
    try {
      const response = await api.post("/ai/guide", {
        task,
        context,
      });
      return response.data;
    } catch (error) {
      console.error("Guide Error:", error);
      throw error;
    }
  },

  // Get conversation suggestions
  getSuggestions: async () => {
    try {
      const response = await api.get("/ai/suggestions");
      return response.data;
    } catch (error) {
      console.error("Suggestions Error:", error);
      return {
        success: false,
        suggestions: [],
      };
    }
  },

  // Get user context for AI
  getUserContext: () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const currentPath = window.location.pathname;

    return {
      isAuthenticated: !!user,
      userRole: user?.role || null,
      userName: user?.name || null,
      currentPage: currentPath,
      currentTime: new Date().toLocaleTimeString(),
      screenWidth: window.innerWidth,
      isMobile: window.innerWidth < 768,
    };
  },
};










// import api from "./api";

// export const aiAssistantService = {
//   // Send message to AI assistant
//   sendMessage: async (message, context = {}) => {
//     try {
//       const response = await api.post("/ai/chat", {
//         message,
//         context,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("AI Assistant Error:", error);

//       // Handle specific Gemini errors
//       if (error.response?.status === 429) {
//         throw new Error("AI service is busy. Please try again in a moment.");
//       } else if (error.response?.status === 503) {
//         throw new Error("AI service is temporarily unavailable.");
//       }

//       throw error;
//     }
//   },

//   // Get quick actions based on user context
//   getQuickActions: async () => {
//     try {
//       const response = await api.get("/ai/quick-actions");
//       return response.data;
//     } catch (error) {
//       console.error("Quick Actions Error:", error);
//       return {
//         success: false,
//         actions: [],
//       };
//     }
//   },

//   // Get step-by-step guide
//   getGuide: async (task, context = {}) => {
//     try {
//       const response = await api.post("/ai/guide", {
//         task,
//         context,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Guide Error:", error);
//       throw error;
//     }
//   },

//   // Get conversation suggestions
//   getSuggestions: async () => {
//     try {
//       const response = await api.get("/ai/suggestions");
//       return response.data;
//     } catch (error) {
//       console.error("Suggestions Error:", error);
//       return {
//         success: false,
//         suggestions: [],
//       };
//     }
//   },

//   // Test AI connection
//   testAIConnection: async () => {
//     try {
//       const response = await api.get("/ai/test");
//       return response.data;
//     } catch (error) {
//       console.error("AI Connection Test Error:", error);
//       return {
//         success: false,
//         message: "Failed to connect to AI service",
//       };
//     }
//   },

//   // Get user context for AI
//   getUserContext: () => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const currentPath = window.location.pathname;
//     const hour = new Date().getHours();

//     let timeOfDay = "day";
//     if (hour < 12) timeOfDay = "morning";
//     else if (hour < 17) timeOfDay = "afternoon";
//     else if (hour < 21) timeOfDay = "evening";
//     else timeOfDay = "night";

//     return {
//       isAuthenticated: !!user,
//       userRole: user?.role || null,
//       userName: user?.name || null,
//       currentPage: currentPath,
//       currentTime: new Date().toLocaleTimeString(),
//       timeOfDay: timeOfDay,
//       screenWidth: window.innerWidth,
//       isMobile: window.innerWidth < 768,
//       isDesktop: window.innerWidth >= 1024,
//     };
//   },
// };