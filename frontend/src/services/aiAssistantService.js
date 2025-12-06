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
