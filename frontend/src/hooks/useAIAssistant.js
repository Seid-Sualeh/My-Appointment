import { useState, useCallback, useEffect } from "react";
import { aiAssistantService } from "../services/aiAssistantService";
import toast from "react-hot-toast";

const useAIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      content:
        "👋 Hello! I'm your AppointMate AI Assistant. I can help you navigate the appointment system, answer questions, and guide you through tasks. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    };

    setMessages([welcomeMessage]);
    loadQuickActions();
    loadSuggestions();
  }, []);

  const loadQuickActions = async () => {
    try {
      const response = await aiAssistantService.getQuickActions();
      if (response.success) {
        setQuickActions(response.actions);
      }
    } catch (error) {
      console.error("Failed to load quick actions:", error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await aiAssistantService.getSuggestions();
      if (response.success) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get user context
      const context = aiAssistantService.getUserContext();

      // Send to AI
      const response = await aiAssistantService.sendMessage(content, context);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          content: response.response,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (error) {
      console.error("AI Response Error:", error);

      let errorContent =
        "I'm having trouble connecting right now. Please try again in a moment or check your internet connection.";
      let toastMessage = "Failed to get AI response";

      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 429) {
          // Use fallback message if available, otherwise use default rate limit message
          errorContent =
            error.response.data?.fallbackMessage ||
            "I'm currently experiencing high demand. Please try again later or use the quick actions below. You can still ask questions about registration, booking appointments, managing your account, and other system features.";
          toastMessage =
            error.response.data?.message ||
            "AI service is temporarily unavailable";
        } else if (error.response.data?.fallbackMessage) {
          errorContent = error.response.data.fallbackMessage;
          toastMessage = error.response.data.message;
        } else if (error.response.status === 500) {
          errorContent =
            "I'm having technical difficulties. Please try again or use the quick actions below for immediate help.";
        }
      } else if (error.message.includes("insufficient_quota")) {
        errorContent =
          "I'm currently experiencing high demand. Please try again later or use the quick actions below.";
        toastMessage = "AI service is temporarily unavailable";
      }

      const errorMessage = {
        id: Date.now() + 1,
        content: errorContent,
        sender: "ai",
        timestamp: new Date(),
        type: "error",
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error(toastMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStepByStepGuide = useCallback(async (task) => {
    setIsLoading(true);

    try {
      const context = aiAssistantService.getUserContext();
      const response = await aiAssistantService.getGuide(task, context);

      if (response.success) {
        const guideMessage = {
          id: Date.now(),
          content: response.guide,
          sender: "ai",
          timestamp: new Date(),
          type: "guide",
        };

        setMessages((prev) => [...prev, guideMessage]);
      }
    } catch (error) {
      console.error("Guide Error:", error);
      toast.error("Failed to generate guide");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const quickActionClick = useCallback(
    (query) => {
      sendMessage(query);
    },
    [sendMessage]
  );

  const suggestionClick = useCallback(
    (suggestion) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    const welcomeMessage = {
      id: Date.now(),
      content: "Chat cleared! How can I help you now?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    };

    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isLoading,
    quickActions,
    suggestions,
    isMinimized,
    setIsMinimized,
    sendMessage,
    getStepByStepGuide,
    quickActionClick,
    suggestionClick,
    clearChat,
  };
};

export default useAIAssistant;
