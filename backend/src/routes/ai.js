const express = require("express");
const router = express.Router();
const aiService = require("../services/aiService");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Rate limiting for AI requests
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: { message: "Too many AI requests, please try again later." },
});

// Get AI response
router.post("/chat", aiLimiter, async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a string",
      });
    }

    // Check if AI service is available
    if (!aiService.available) {
      // Provide a helpful fallback response when AI is not available
      const fallbackResponses = {
        hello:
          "Hello! I'm your Appointment Assistant. How can I help you with the appointment system today?",
        "how do i register":
          "To register, click on the 'Register' button on the homepage, fill in your details, and verify your email address.",
        "how do i book an appointment":
          "To book an appointment, first register and login, then go to the 'Appointments' page where you can search for businesses and book available time slots.",
        "what can you do":
          "I can help you with registration, booking appointments, managing your account, and answering questions about the appointment system.",
        help: "I'm here to help! You can ask me about registration, booking appointments, managing your account, or any other questions about the appointment system.",
      };

      // Try to find a matching fallback response
      const lowerMessage = message.toLowerCase();
      let foundResponse = null;

      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(key)) {
          foundResponse = response;
          break;
        }
      }

      if (foundResponse) {
        return res.json({
          success: true,
          response: foundResponse,
          timestamp: new Date().toISOString(),
          fallback: true,
        });
      }

      // Generic fallback response
      return res.json({
        success: true,
        response:
          "I'm currently unable to process your request with AI, but here's some helpful information: You can register as a user or business, book appointments, manage your schedule, and get help with any questions about the appointment system. Try asking more specific questions!",
        timestamp: new Date().toISOString(),
        fallback: true,
      });
    }

    const response = await aiService.generateResponse(message, context);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    // Handle 404 errors from AI service
    if (
      error.message.includes("404") ||
      error.message.includes("NOT_FOUND") ||
      error.message.includes("resource not found")
    ) {
      return res.status(404).json({
        success: false,
        message: "AI service resource not found",
        fallback: true,
        fallbackMessage:
          "I couldn't find the information you requested. Please try asking your question differently or use the quick actions below for common tasks.",
        timestamp: new Date().toISOString(),
      });
    }

    // Handle rate limit and quota errors with fallback responses
    if (
      error.message.includes("insufficient_quota") ||
      error.message.includes("429") ||
      error.message.includes("quota") ||
      error.message.includes("rate limit")
    ) {
      return res.status(429).json({
        success: false,
        message: "AI service is temporarily unavailable due to high demand",
        fallback: true,
        fallbackMessage:
          "I'm currently experiencing high demand. Please try again later or use the quick actions below. You can still ask questions about registration, booking appointments, managing your account, and other system features.",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message,
    });
  }
});

// Get quick actions based on user context
router.get("/quick-actions", async (req, res) => {
  try {
    // Get user info if authenticated, otherwise use null/guest context
    const userRole = req.user?.role || null;
    const isAuthenticated = !!req.user;

    const actions = await aiService.getQuickActions(userRole, isAuthenticated);

    res.json({
      success: true,
      actions,
    });
  } catch (error) {
    console.error("Quick actions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get quick actions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get step-by-step guide for a task
router.post("/guide", aiLimiter, async (req, res) => {
  try {
    const { task, context = {} } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Task description is required",
      });
    }

    const guide = await aiService.generateStepByStepGuide(task, context);

    res.json({
      success: true,
      guide,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate guide",
    });
  }
});

// Get conversation suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const suggestions = [
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

    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get suggestions",
    });
  }
});

module.exports = router;