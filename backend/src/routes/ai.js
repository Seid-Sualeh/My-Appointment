// const express = require("express");
// const router = express.Router();
// const aiService = require("../services/aiService");
// const { protect } = require("../middleware/auth");
// const rateLimit = require("express-rate-limit");

// // Rate limiting for AI requests
// const aiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 30, // limit each IP to 30 requests per windowMs
//   message: { message: "Too many AI requests, please try again later." },
// });

// // Get AI response
// router.post("/chat", aiLimiter, async (req, res, next) => {
//   try {
//     const { message, context = {} } = req.body;

//     if (!message || typeof message !== "string") {
//       return res.status(400).json({
//         success: false,
//         message: "Message is required and must be a string",
//       });
//     }

//     // Check if AI service is available
//     if (!aiService.available) {
//       // Provide a helpful fallback response when AI is not available
//       const fallbackResponses = {
//         hello:
//           "Hello! I'm your Appointment Assistant. How can I help you with the appointment system today?",
//         "how do i register":
//           "To register, click on the 'Register' button on the homepage, fill in your details, and verify your email address.",
//         "how do i book an appointment":
//           "To book an appointment, first register and login, then go to the 'Appointments' page where you can search for businesses and book available time slots.",
//         "what can you do":
//           "I can help you with registration, booking appointments, managing your account, and answering questions about the appointment system.",
//         help: "I'm here to help! You can ask me about registration, booking appointments, managing your account, or any other questions about the appointment system.",
//       };

//       // Try to find a matching fallback response
//       const lowerMessage = message.toLowerCase();
//       let foundResponse = null;

//       for (const [key, response] of Object.entries(fallbackResponses)) {
//         if (lowerMessage.includes(key)) {
//           foundResponse = response;
//           break;
//         }
//       }

//       if (foundResponse) {
//         return res.json({
//           success: true,
//           response: foundResponse,
//           timestamp: new Date().toISOString(),
//           fallback: true,
//         });
//       }

//       // Generic fallback response
//       return res.json({
//         success: true,
//         response:
//           "I'm currently unable to process your request with AI, but here's some helpful information: You can register as a user or business, book appointments, manage your schedule, and get help with any questions about the appointment system. Try asking more specific questions!",
//         timestamp: new Date().toISOString(),
//         fallback: true,
//       });
//     }

//     const response = await aiService.generateResponse(message, context);

//     res.json({
//       success: true,
//       response,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("AI Chat Error:", error);

//     // Handle rate limit and quota errors with fallback responses
//     if (
//       error.message.includes("insufficient_quota") ||
//       error.message.includes("429")
//     ) {
//       return res.status(429).json({
//         success: false,
//         message: "AI service is temporarily unavailable due to high demand",
//         fallback: true,
//         fallbackMessage:
//           "I'm currently experiencing high demand. Please try again later or use the quick actions below. You can still ask questions about registration, booking appointments, managing your account, and other system features.",
//         timestamp: new Date().toISOString(),
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to get AI response",
//       error: error.message,
//     });
//   }
// });

// // Get quick actions based on user context
// router.get("/quick-actions", async (req, res) => {
//   try {
//     // Get user info if authenticated, otherwise use null/guest context
//     const userRole = req.user?.role || null;
//     const isAuthenticated = !!req.user;

//     const actions = await aiService.getQuickActions(userRole, isAuthenticated);

//     res.json({
//       success: true,
//       actions,
//     });
//   } catch (error) {
//     console.error("Quick Actions Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get quick actions",
//     });
//   }
// });

// // Get step-by-step guide for a task
// router.post("/guide", aiLimiter, async (req, res) => {
//   try {
//     const { task, context = {} } = req.body;

//     if (!task) {
//       return res.status(400).json({
//         success: false,
//         message: "Task description is required",
//       });
//     }

//     const guide = await aiService.generateStepByStepGuide(task, context);

//     res.json({
//       success: true,
//       guide,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("Guide Generation Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate guide",
//     });
//   }
// });

// // Get conversation suggestions
// router.get("/suggestions", async (req, res) => {
//   try {
//     const suggestions = [
//       "How do I register as a business?",
//       "What's the process for booking my first appointment?",
//       "How do I set up available time slots?",
//       "Can I cancel an appointment?",
//       "What features are available for business users?",
//       "How does email verification work?",
//       "What should I do if I forgot my password?",
//       "How do I view my upcoming appointments?",
//       "What's the difference between pending and confirmed appointments?",
//       "How do I update my business profile?",
//     ];

//     res.json({
//       success: true,
//       suggestions,
//     });
//   } catch (error) {
//     console.error("Suggestions Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get suggestions",
//     });
//   }
// });

// module.exports = router;










const express = require("express");
const router = express.Router();
const aiService = require("../services/aiService");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Rate limiting for AI requests
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Gemini has generous limits, but we'll still limit
  message: { message: "Too many AI requests, please try again later." },
});

// Test Gemini connection
router.get("/test", async (req, res) => {
  try {
    const isConnected = await aiService.testConnection();

    res.json({
      success: isConnected,
      message: isConnected
        ? "Gemini AI is connected and ready"
        : "Failed to connect to Gemini AI",
      service: "Google Gemini",
      model: process.env.GEMINI_MODEL || "gemini-pro",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gemini AI test failed",
      error: error.message,
    });
  }
});

// Get AI response
router.post("/chat", aiLimiter, async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a string",
      });
    }

    // Validate message length
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message too long. Please keep under 1000 characters.",
      });
    }

    const response = await aiService.generateResponse(message, context);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      service: "Google Gemini",
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    // Provide user-friendly error messages
    let statusCode = 500;
    let errorMessage = "Failed to get AI response";

    if (error.message.includes("API key")) {
      statusCode = 503;
      errorMessage = "AI service configuration error";
    } else if (error.message.includes("quota")) {
      statusCode = 429;
      errorMessage = "AI service quota exceeded. Please try again later.";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get quick actions based on user context
router.get("/quick-actions", protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    const isAuthenticated = !!req.user;

    const actions = await aiService.getQuickActions(userRole, isAuthenticated);

    res.json({
      success: true,
      actions,
    });
  } catch (error) {
    console.error("Quick Actions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get quick actions",
    });
  }
});

// Get step-by-step guide for a task
router.post("/guide", aiLimiter, async (req, res) => {
  try {
    const { task, context = {} } = req.body;

    if (!task || task.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Valid task description is required (max 500 characters)",
      });
    }

    const guide = await aiService.generateStepByStepGuide(task, context);

    res.json({
      success: true,
      guide,
      timestamp: new Date().toISOString(),
      service: "Google Gemini",
    });
  } catch (error) {
    console.error("Guide Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate guide",
    });
  }
});

// Get conversation suggestions
router.get("/suggestions", async (req, res) => {
  try {
    // Use Gemini to generate dynamic suggestions based on time of day
    const hour = new Date().getHours();
    let timeBasedSuggestions = [];

    if (hour < 12) {
      timeBasedSuggestions = [
        "How do I set up my schedule for today?",
        "What appointments do I have coming up today?",
        "How do I check my morning appointments?",
      ];
    } else if (hour < 18) {
      timeBasedSuggestions = [
        "How do I manage my afternoon appointments?",
        "Can I book a last-minute appointment?",
        "How do I reschedule for tomorrow?",
      ];
    } else {
      timeBasedSuggestions = [
        "How do I prepare my schedule for tomorrow?",
        "What should I do if I need to cancel an appointment for tomorrow?",
        "How do I check my upcoming week's appointments?",
      ];
    }

    const generalSuggestions = [
      "How do I register as a business?",
      "What's the process for booking my first appointment?",
      "How do I set up available time slots?",
      "Can I cancel an appointment?",
      "What features are available for business users?",
      "How does email verification work?",
      "What should I do if I forgot my password?",
      "How do I view my upcoming appointments?",
      "What's the difference between pending and confirmed appointments?",
      "How do I update my business profile?",
    ];

    // Mix time-based and general suggestions
    const suggestions = [...timeBasedSuggestions, ...generalSuggestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    res.json({
      success: true,
      suggestions,
      service: "Google Gemini",
    });
  } catch (error) {
    console.error("Suggestions Error:", error);
    // Fallback to static suggestions
    const fallbackSuggestions = [
      "How do I register?",
      "How do I book an appointment?",
      "How do I manage my appointments?",
      "How do I set up time slots?",
    ];

    res.json({
      success: true,
      suggestions: fallbackSuggestions,
      service: "Google Gemini",
    });
  }
});

module.exports = router;