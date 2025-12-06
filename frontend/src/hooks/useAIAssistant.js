// import { useState, useCallback, useEffect } from "react";
// import { aiAssistantService } from "../services/aiAssistantService";
// import toast from "react-hot-toast";

// const useAIAssistant = () => {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [quickActions, setQuickActions] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [isMinimized, setIsMinimized] = useState(true);

//   // Initialize with welcome message
//   useEffect(() => {
//     const welcomeMessage = {
//       id: Date.now(),
//       content:
//         "👋 Hello! I'm your AppointMate AI Assistant. I can help you navigate the appointment system, answer questions, and guide you through tasks. How can I help you today?",
//       sender: "ai",
//       timestamp: new Date(),
//       type: "text",
//     };

//     setMessages([welcomeMessage]);
//     loadQuickActions();
//     loadSuggestions();
//   }, []);

//   const loadQuickActions = async () => {
//     try {
//       const response = await aiAssistantService.getQuickActions();
//       if (response.success) {
//         setQuickActions(response.actions);
//       }
//     } catch (error) {
//       console.error("Failed to load quick actions:", error);
//     }
//   };

//   const loadSuggestions = async () => {
//     try {
//       const response = await aiAssistantService.getSuggestions();
//       if (response.success) {
//         setSuggestions(response.suggestions);
//       }
//     } catch (error) {
//       console.error("Failed to load suggestions:", error);
//     }
//   };

//   const sendMessage = useCallback(async (content) => {
//     if (!content.trim()) return;

//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       content,
//       sender: "user",
//       timestamp: new Date(),
//       type: "text",
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       // Get user context
//       const context = aiAssistantService.getUserContext();

//       // Send to AI
//       const response = await aiAssistantService.sendMessage(content, context);

//       if (response.success) {
//         const aiMessage = {
//           id: Date.now() + 1,
//           content: response.response,
//           sender: "ai",
//           timestamp: new Date(),
//           type: "text",
//         };

//         setMessages((prev) => [...prev, aiMessage]);
//       } else {
//         throw new Error(response.message || "Failed to get response");
//       }
//     } catch (error) {
//       console.error("AI Response Error:", error);

//       let errorContent =
//         "I'm having trouble connecting right now. Please try again in a moment or check your internet connection.";
//       let toastMessage = "Failed to get AI response";

//       // Handle specific error cases
//       if (error.response) {
//         if (error.response.status === 429) {
//           // Use fallback message if available, otherwise use default rate limit message
//           errorContent =
//             error.response.data?.fallbackMessage ||
//             "I'm currently experiencing high demand. Please try again later or use the quick actions below. You can still ask questions about registration, booking appointments, managing your account, and other system features.";
//           toastMessage =
//             error.response.data?.message ||
//             "AI service is temporarily unavailable";
//         } else if (error.response.data?.fallbackMessage) {
//           errorContent = error.response.data.fallbackMessage;
//           toastMessage = error.response.data.message;
//         } else if (error.response.status === 500) {
//           errorContent =
//             "I'm having technical difficulties. Please try again or use the quick actions below for immediate help.";
//         }
//       } else if (error.message.includes("insufficient_quota")) {
//         errorContent =
//           "I'm currently experiencing high demand. Please try again later or use the quick actions below.";
//         toastMessage = "AI service is temporarily unavailable";
//       }

//       const errorMessage = {
//         id: Date.now() + 1,
//         content: errorContent,
//         sender: "ai",
//         timestamp: new Date(),
//         type: "error",
//       };

//       setMessages((prev) => [...prev, errorMessage]);
//       toast.error(toastMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const getStepByStepGuide = useCallback(async (task) => {
//     setIsLoading(true);

//     try {
//       const context = aiAssistantService.getUserContext();
//       const response = await aiAssistantService.getGuide(task, context);

//       if (response.success) {
//         const guideMessage = {
//           id: Date.now(),
//           content: response.guide,
//           sender: "ai",
//           timestamp: new Date(),
//           type: "guide",
//         };

//         setMessages((prev) => [...prev, guideMessage]);
//       }
//     } catch (error) {
//       console.error("Guide Error:", error);
//       toast.error("Failed to generate guide");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const quickActionClick = useCallback(
//     (query) => {
//       sendMessage(query);
//     },
//     [sendMessage]
//   );

//   const suggestionClick = useCallback(
//     (suggestion) => {
//       sendMessage(suggestion);
//     },
//     [sendMessage]
//   );

//   const clearChat = useCallback(() => {
//     const welcomeMessage = {
//       id: Date.now(),
//       content: "Chat cleared! How can I help you now?",
//       sender: "ai",
//       timestamp: new Date(),
//       type: "text",
//     };

//     setMessages([welcomeMessage]);
//   }, []);

//   return {
//     messages,
//     isLoading,
//     quickActions,
//     suggestions,
//     isMinimized,
//     setIsMinimized,
//     sendMessage,
//     getStepByStepGuide,
//     quickActionClick,
//     suggestionClick,
//     clearChat,
//   };
// };

// export default useAIAssistant;



import { useState, useCallback, useEffect } from "react";
import { aiAssistantService } from "../services/aiAssistantService";
import toast from "react-hot-toast";

const useAIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiStatus, setAiStatus] = useState("checking"); // checking, connected, error

  // Initialize with welcome message and test connection
  useEffect(() => {
    const initAI = async () => {
      // Test AI connection
      const status = await aiAssistantService.testAIConnection();
      setAiStatus(status.success ? "connected" : "error");

      let welcomeMessage = "";
      if (status.success) {
        welcomeMessage =
          "👋 Hello! I'm your AppointMate AI Assistant, powered by Google Gemini. I can help you navigate the appointment system, answer questions, and guide you through tasks. How can I help you today?";
      } else {
        welcomeMessage =
          "👋 Hello! I'm your AppointMate AI Assistant. Note: AI features are currently limited. I can still help with basic guidance using my built-in knowledge. How can I help you today?";
      }

      setMessages([
        {
          id: Date.now(),
          content: welcomeMessage,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        },
      ]);

      loadQuickActions();
      loadSuggestions();
    };

    initAI();
  }, []);

  const loadQuickActions = async () => {
    try {
      const response = await aiAssistantService.getQuickActions();
      if (response.success) {
        setQuickActions(response.actions);
      } else {
        // Fallback quick actions
        setQuickActions([
          {
            label: "📝 How to register?",
            query: "How do I create an account?",
          },
          {
            label: "📅 Book appointment",
            query: "How do I book an appointment?",
          },
          {
            label: "👀 View appointments",
            query: "How do I see my appointments?",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load quick actions:", error);
      setQuickActions([]);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await aiAssistantService.getSuggestions();
      if (response.success) {
        setSuggestions(response.suggestions);
      } else {
        // Fallback suggestions
        setSuggestions([
          "How do I register?",
          "How do I book an appointment?",
          "How do I manage my appointments?",
          "How do I set up time slots?",
        ]);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      setSuggestions([]);
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
          service: response.service,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (error) {
      console.error("AI Response Error:", error);

      let errorContent =
        "I'm having trouble connecting to the AI service right now. ";

      if (error.message.includes("busy")) {
        errorContent =
          "The AI service is currently busy. Please try again in a few moments.";
      } else if (error.message.includes("unavailable")) {
        errorContent =
          "AI features are temporarily unavailable. You can still use the appointment system normally.";
      } else {
        errorContent =
          "I'm having trouble processing your request. Please try again or ask a different question.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        content: errorContent,
        sender: "ai",
        timestamp: new Date(),
        type: "error",
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || "Failed to get AI response");
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
          service: response.service,
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
      content:
        aiStatus === "connected"
          ? "Chat cleared! How can I help you now?"
          : "Chat cleared! I'm ready to help with basic guidance.",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    };

    setMessages([welcomeMessage]);
  }, [aiStatus]);

  return {
    messages,
    isLoading,
    quickActions,
    suggestions,
    isMinimized,
    aiStatus,
    setIsMinimized,
    sendMessage,
    getStepByStepGuide,
    quickActionClick,
    suggestionClick,
    clearChat,
  };
};

export default useAIAssistant;