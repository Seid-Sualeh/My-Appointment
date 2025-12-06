// let GeminiAI;
// try {
//   GeminiAI = require("@google/generative-ai");
// } catch (error) {
//   console.warn("Gemini AI module not found. AI features will be disabled.");
// }

// const dotenv = require("dotenv");

// dotenv.config();

// class AIService {
//   constructor() {
//     // Check if Gemini AI is available
//     if (!GeminiAI) {
//       console.warn("Gemini AI module not available. AI features disabled.");
//       this.available = false;
//       return;
//     }

//     // Check if API key is configured
//     if (!process.env.GEMINI_API_KEY) {
//       console.warn("Gemini API key not configured. AI features disabled.");
//       this.available = false;
//       return;
//     }

//     this.gemini = new GeminiAI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     this.model = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";
//     this.systemPrompt = this.getSystemPrompt();
//     this.available = true;
//   }

//   getSystemPrompt() {
//     return `You are "${
//       process.env.AI_ASSISTANT_NAME || "Appointment Assistant"
//     }", a helpful AI assistant for an Appointment Management System.

// SYSTEM INFORMATION:
// - Platform: Appointment Management System with React frontend and Node.js/Express/MongoDB backend
// - URL: http://localhost:5173 (frontend), http://localhost:5000 (backend)
// - Current Date: ${new Date().toDateString()}

// APPLICATION FEATURES:
// 1. User Authentication:
//    - Registration with email verification
//    - Login with JWT tokens
//    - Social login (Google/Facebook)
//    - Password reset functionality

// 2. User Roles:
//    - Customer: Can book, view, and cancel appointments
//    - Business: Can manage time slots, view appointments, update statuses

// 3. Core Features:
//    - Calendar view with FullCalendar integration
//    - Time slot management for businesses
//    - Appointment booking system
//    - Email reminders via cron jobs
//    - Business dashboard with statistics
//    - Customer appointment management

// 4. Key Pages:
//    - Home (/): Landing page with features
//    - Login (/login): Authentication page
//    - Register (/register): Account creation
//    - Dashboard (/dashboard): Role-specific dashboard
//    - Appointments (/appointments): Book/view appointments
//    - Business Admin (/business-admin): Business management
//    - Profile (/profile): User profile management
//    - Forgot Password (/forgot-password): Password recovery
//    - Reset Password (/reset-password/:token): Password reset
//    - Verify Email (/verify-email/:token): Email verification

// TASK FLOWS:

// BUSINESS FLOW:
// 1. Register as business → Verify email → Login → Complete profile → Create time slots → View appointments → Update statuses

// CUSTOMER FLOW:
// 1. Register as customer → Verify email → Login → Search businesses → View calendar → Book appointment → Manage appointments

// GUIDELINES:
// 1. Be concise but helpful
// 2. Provide step-by-step instructions when needed
// 3. Include specific URLs when relevant
// 4. Mention if a feature requires authentication
// 5. For complex tasks, break them down into simple steps
// 6. Use emojis sparingly to make responses friendly
// 7. Always maintain a professional but approachable tone

// RESPONSE FORMAT:
// - Start with a greeting if it's a new conversation
// - Provide clear, actionable steps
// - Include relevant links when helpful
// - End with a follow-up question if appropriate

// IMPORTANT NOTES:
// - Users may be logged in or not
// - Role determines available features
// - Some features require email verification
// - Time slots are business-specific
// - Appointments can be cancelled 2+ hours in advance

// Your goal is to help users navigate the system, troubleshoot issues, and complete tasks efficiently.`;
//   }

//   async generateResponse(userMessage, context = {}) {
//     if (!this.available) {
//       throw new Error(
//         "AI service is not available. Please configure Gemini API key."
//       );
//     }

//     try {
//       const model = this.gemini.getGenerativeModel({ model: this.model });

//       const prompt = `User Context: ${JSON.stringify(context)}

// User Question: ${userMessage}

// System Context: ${this.systemPrompt}`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();

//       return text;
//     } catch (error) {
//       console.error("AI Service Error:", error);

//       // Handle specific Gemini errors with better user messages
//       if (error.message.includes("429") || error.message.includes("quota")) {
//         throw new Error(
//           "AI service is temporarily unavailable due to high demand. Please try again later or use the quick actions below."
//         );
//       } else if (
//         error.message.includes("invalid_api_key") ||
//         error.message.includes("API key")
//       ) {
//         throw new Error(
//           "AI service configuration error. Please contact support."
//         );
//       } else if (error.message.includes("network")) {
//         throw new Error(
//           "Network error connecting to AI service. Please check your internet connection."
//         );
//       } else {
//         throw new Error("Failed to generate AI response. Please try again.");
//       }
//     }
//   }

//   async getQuickActions(userRole, isAuthenticated) {
//     const actions = {
//       unauthenticated: [
//         { label: "How to register?", query: "How do I create an account?" },
//         { label: "Login help", query: "How do I login to the system?" },
//         {
//           label: "Business vs Customer",
//           query:
//             "What is the difference between business and customer accounts?",
//         },
//       ],
//       customer: [
//         {
//           label: "Book appointment",
//           query: "How do I book an appointment with a business?",
//         },
//         {
//           label: "View my appointments",
//           query: "Where can I see all my appointments?",
//         },
//         {
//           label: "Cancel appointment",
//           query: "How do I cancel or reschedule an appointment?",
//         },
//         { label: "Find businesses", query: "How do I search for businesses?" },
//       ],
//       business: [
//         {
//           label: "Set up time slots",
//           query: "How do I create available time slots for customers?",
//         },
//         {
//           label: "Manage appointments",
//           query: "How do I view and manage customer appointments?",
//         },
//         {
//           label: "Update appointment status",
//           query: "How do I change the status of an appointment?",
//         },
//         {
//           label: "View dashboard",
//           query: "What information is available on the business dashboard?",
//         },
//       ],
//     };

//     if (!isAuthenticated) return actions.unauthenticated;
//     return actions[userRole] || actions.unauthenticated;
//   }

//   async generateStepByStepGuide(task, context) {
//     if (!this.available) {
//       throw new Error(
//         "AI service is not available. Please configure Gemini API key."
//       );
//     }

//     const model = this.gemini.getGenerativeModel({ model: this.model });

//     const prompt = `Generate a step-by-step guide for the following task in our appointment management system:

// Task: ${task}
// User Context: ${JSON.stringify(context)}

// Format the response as:
// 1. Clear numbered steps
// 2. Each step should be specific and actionable
// 3. Include relevant page names or button labels
// 4. Mention any prerequisites
// 5. Keep it concise but complete

// System Context: ${this.systemPrompt}

// Guide:`;

//     try {
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       return response.text();
//     } catch (error) {
//       console.error("Guide Generation Error:", error);
//       throw new Error(
//         "Failed to generate step-by-step guide. Please try again."
//       );
//     }
//   }
// }

// module.exports = new AIService();














const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.GEMINI_MODEL || "gemini-pro";
    this.systemPrompt = this.getSystemPrompt();
    this.generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 500,
    };
  }

  getSystemPrompt() {
    return `You are "${
      process.env.AI_ASSISTANT_NAME || "Appointment Assistant"
    }", a helpful AI assistant for an Appointment Management System.

PERSONALITY & STYLE:
- Be concise, helpful, and friendly
- Use bullet points and numbered steps for clarity
- Include relevant URLs when helpful
- Keep responses under 500 words
- Use emojis sparingly (1-2 per response)

SYSTEM INFORMATION:
- Platform: Appointment Management System with React frontend and Node.js/Express/MongoDB backend
- URL: http://localhost:5173 (frontend), http://localhost:5000 (backend)
- Current Date: ${new Date().toDateString()}

APPLICATION FEATURES:
1. User Authentication:
   - Registration with email verification
   - Login with JWT tokens
   - Social login (Google/Facebook)
   - Password reset functionality

2. User Roles:
   - Customer: Can book, view, and cancel appointments
   - Business: Can manage time slots, view appointments, update statuses

3. Core Features:
   - Calendar view with FullCalendar integration
   - Time slot management for businesses
   - Appointment booking system
   - Email reminders via cron jobs
   - Business dashboard with statistics
   - Customer appointment management

4. Key Pages:
   - Home (/): Landing page with features
   - Login (/login): Authentication page
   - Register (/register): Account creation
   - Dashboard (/dashboard): Role-specific dashboard
   - Appointments (/appointments): Book/view appointments
   - Business Admin (/business-admin): Business management
   - Profile (/profile): User profile management
   - Forgot Password (/forgot-password): Password recovery
   - Reset Password (/reset-password/:token): Password reset
   - Verify Email (/verify-email/:token): Email verification

TASK FLOWS:

BUSINESS FLOW:
1. Register as business → Verify email → Login → Complete profile → Create time slots → View appointments → Update statuses

CUSTOMER FLOW:
1. Register as customer → Verify email → Login → Search businesses → View calendar → Book appointment → Manage appointments

RESPONSE GUIDELINES:
1. Always provide actionable steps
2. Include specific page URLs when relevant
3. Mention authentication requirements
4. Break complex tasks into numbered steps
5. End with a helpful follow-up question
6. Be optimistic and encouraging

SAFETY GUIDELINES:
- Do not provide code implementation
- Do not share sensitive system information
- Do not make promises about system capabilities
- Focus on guiding users through existing features`;
  }

  async generateResponse(userMessage, context = {}) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: this.generationConfig,
      });

      const prompt = `${this.systemPrompt}

Current User Context:
- Authenticated: ${context.isAuthenticated ? "Yes" : "No"}
- Role: ${context.userRole || "Not logged in"}
- Current Page: ${context.currentPage || "Unknown"}
- Time: ${context.currentTime || "Unknown"}

User Question: ${userMessage}

Provide a helpful, actionable response:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Clean up the response text
      let text = response.text();

      // Remove any markdown code blocks if present
      text = text
        .replace(/```[\s\S]*?\n/g, "")
        .replace(/```/g, "")
        .trim();

      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);

      // Provide helpful error messages
      if (error.message.includes("API key")) {
        throw new Error(
          "AI service configuration error. Please contact support."
        );
      } else if (error.message.includes("quota")) {
        throw new Error(
          "AI service temporarily unavailable. Please try again later."
        );
      } else {
        throw new Error(
          "I encountered an error. Please try rephrasing your question."
        );
      }
    }
  }

  async getQuickActions(userRole, isAuthenticated) {
    const actions = {
      unauthenticated: [
        {
          label: "📝 How to register?",
          query: "How do I create an account?",
        },
        {
          label: "🔐 Login help",
          query: "How do I login to the system?",
        },
        {
          label: "🏢 Business vs Customer",
          query:
            "What is the difference between business and customer accounts?",
        },
      ],
      customer: [
        {
          label: "📅 Book appointment",
          query: "How do I book an appointment with a business?",
        },
        {
          label: "👀 View my appointments",
          query: "Where can I see all my appointments?",
        },
        {
          label: "❌ Cancel appointment",
          query: "How do I cancel or reschedule an appointment?",
        },
        {
          label: "🔍 Find businesses",
          query: "How do I search for businesses?",
        },
      ],
      business: [
        {
          label: "⏰ Set up time slots",
          query: "How do I create available time slots for customers?",
        },
        {
          label: "📊 Manage appointments",
          query: "How do I view and manage customer appointments?",
        },
        {
          label: "🔄 Update status",
          query: "How do I change the status of an appointment?",
        },
        {
          label: "📈 View dashboard",
          query: "What information is available on the business dashboard?",
        },
      ],
    };

    if (!isAuthenticated) return actions.unauthenticated;
    return actions[userRole] || actions.unauthenticated;
  }

  async generateStepByStepGuide(task, context) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        generationConfig: {
          ...this.generationConfig,
          maxOutputTokens: 800,
          temperature: 0.5,
        },
      });

      const prompt = `${this.systemPrompt}

User Context:
- Role: ${context.userRole || "Not logged in"}
- Authenticated: ${context.isAuthenticated ? "Yes" : "No"}
- Current Page: ${context.currentPage || "Unknown"}

Generate a step-by-step guide for: ${task}

Format Requirements:
1. Start with a brief introduction
2. Use numbered steps (1., 2., 3.)
3. Each step should be clear and actionable
4. Include specific page names or button labels
5. Mention any prerequisites
6. End with a summary or next steps
7. Keep it concise but complete

Guide:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return response.text().trim();
    } catch (error) {
      console.error("Guide Generation Error:", error);
      throw new Error("Failed to generate guide. Please try again.");
    }
  }

  // Test Gemini API connection
  async testConnection() {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = "Say 'AI Assistant is ready!'";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().includes("ready");
    } catch (error) {
      console.error("Gemini Test Connection Error:", error);
      return false;
    }
  }
}

module.exports = new AIService();