let GeminiAI;
try {
  GeminiAI = require("@google/generative-ai");
} catch (error) {}

const dotenv = require("dotenv");

dotenv.config();

class AIService {
  constructor() {
    // Check if Gemini AI is available
    if (!GeminiAI) {
      this.available = false;
      return;
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      this.available = false;
      return;
    }

    this.gemini = new GeminiAI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.GEMINI_MODEL || "gemini-pro";
    this.systemPrompt = this.getSystemPrompt();
    this.available = true;
  }

  getSystemPrompt() {
    return `You are "${
      process.env.AI_ASSISTANT_NAME || "Appointment Assistant"
    }", a helpful AI assistant for an Appointment Management System.

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

GUIDELINES:
1. Be concise but helpful
2. Provide step-by-step instructions when needed
3. Include specific URLs when relevant
4. Mention if a feature requires authentication
5. For complex tasks, break them down into simple steps
6. Use emojis sparingly to make responses friendly
7. Always maintain a professional but approachable tone

RESPONSE FORMAT:
- Start with a greeting if it's a new conversation
- Provide clear, actionable steps
- Include relevant links when helpful
- End with a follow-up question if appropriate

IMPORTANT NOTES:
- Users may be logged in or not
- Role determines available features
- Some features require email verification
- Time slots are business-specific
- Appointments can be cancelled 2+ hours in advance

Your goal is to help users navigate the system, troubleshoot issues, and complete tasks efficiently.`;
  }

  async generateResponse(userMessage, context = {}) {
    if (!this.available) {
      throw new Error(
        "AI service is not available. Please configure Gemini API key."
      );
    }

    try {
      const model = this.gemini.getGenerativeModel({ model: this.model });

      const prompt = `User Context: ${JSON.stringify(context)}

User Question: ${userMessage}

System Context: ${this.systemPrompt}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("AI Service Error:", error);

      // Handle specific 404 errors from Gemini API
      if (
        error.message.includes("404") ||
        error.message.includes("NOT_FOUND")
      ) {
        throw new Error(
          "AI service resource not found. Please try again or ask a different question."
        );
      }

      // Handle rate limit and quota errors
      if (
        error.message.includes("insufficient_quota") ||
        error.message.includes("429") ||
        error.message.includes("quota") ||
        error.message.includes("rate limit")
      ) {
        throw new Error(
          "AI service is temporarily unavailable due to high demand. Please try again later."
        );
      }

      // Enhanced fallback responses for when Gemini API fails
      const lowerMessage = userMessage.toLowerCase();

      // Comprehensive fallback responses
      const fallbackResponses = {
        // Authentication and registration
        "how do i register":
          "To register, click on the 'Register' button on the homepage, fill in your details including email and password, then verify your email address by clicking the link sent to your inbox. After verification, you can log in to access all features.",
        "how do i login":
          "To login, click on the 'Sign In' button, enter your registered email and password, then click 'Login'. If you forgot your password, use the 'Forgot Password' link to reset it.",
        "what is the difference between business and customer accounts":
          "Business accounts can create time slots, manage appointments, and access business analytics. Customer accounts can search for businesses, book appointments, and manage their own appointments. Choose the account type that matches your needs during registration.",

        // Appointment booking
        "how do i book an appointment":
          "To book an appointment: 1) Login to your account, 2) Go to the 'Appointments' page, 3) Search for businesses or select from available options, 4) Choose an available time slot from the calendar, 5) Confirm your booking details and submit. You'll receive a confirmation email with the appointment details.",
        "what's the process for booking my first appointment":
          "To book your first appointment: 1) Register and verify your email, 2) Login, 3) Go to Appointments page, 4) Search for businesses, 5) Choose a time slot, 6) Confirm booking. You'll get an email confirmation.",
        "how do i book my first appointment":
          "To book your first appointment: 1) Register as a customer, 2) Verify your email via the link sent to your inbox, 3) Login with your credentials, 4) Navigate to the 'Appointments' section, 5) Browse available businesses and their services, 6) Choose a convenient time slot, 7) Complete the booking form and submit. Check your email for the confirmation and appointment details.",
        "how do i find businesses":
          "You can find businesses by going to the 'Appointments' page and using the search function. You can search by business name, service type, or browse through the available options. Each business listing shows their available services and time slots.",
        "how do i see my appointments":
          "To view your appointments, go to the 'Appointments' page after logging in. You'll see a list of all your upcoming and past appointments. You can filter by date, status, or business name. Click on any appointment to see details or manage it.",

        // Appointment management
        "how do i cancel an appointment":
          "To cancel an appointment: 1) Go to the 'Appointments' page, 2) Find the appointment you want to cancel, 3) Click on it to see details, 4) Click the 'Cancel' button. Note that you can only cancel appointments at least 2 hours before the scheduled time.",
        "how do i reschedule an appointment":
          "To reschedule: 1) Go to the 'Appointments' page, 2) Click on the appointment you want to change, 3) Click 'Reschedule', 4) Choose a new available time slot, 5) Confirm the changes. The business will be notified automatically.",

        // Business features
        "how do i create time slots":
          "As a business user: 1) Go to the 'Business Admin' page, 2) Click on 'Time Slot Management', 3) Select the dates and times you're available, 4) Set the duration for each appointment slot, 5) Save your time slots. Customers will be able to book during these available times.",
        "how do i manage appointments":
          "Business users can manage appointments through the 'Business Admin' dashboard. You can view all upcoming appointments, change their status (pending/confirmed/cancelled), add notes, and communicate with customers through the system.",
        "how do i update my business profile":
          "To update your business profile: 1) Go to the 'Profile' page, 2) Click 'Edit Business Information', 3) Update your business name, description, contact details, and services offered, 4) Save your changes. This information will be visible to customers when they search for your business.",

        // General help
        help: "I can help with registration, login, booking appointments, managing your schedule, and answering questions about the appointment system. Try asking specific questions like 'How do I book an appointment?' or 'What features are available for businesses?'",
        "what can you do":
          "I can guide you through the entire appointment system: registration process, login help, booking and managing appointments, business setup and management, troubleshooting issues, and explaining system features. I provide step-by-step instructions for all major tasks.",
        hi: "Hello! I'm your Appointment Assistant. I can help you with registration, booking appointments, managing your account, and answering questions about the appointment system. What would you like help with today?",
        hello:
          "Hi there! I'm here to help you navigate the Appointment Management System. You can ask me about registration, booking appointments, managing your schedule, or any other questions about using the system. How can I assist you?",
      };

      // Try to find a matching fallback response
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(key)) {
          return response;
        }
      }

      // Generic fallback response with helpful guidance
      return (
        "I'm currently unable to connect to the AI service, but here's some helpful information: " +
        "You can register as a user or business, book appointments with available businesses, manage your schedule, " +
        "and get help with any questions about the appointment system. " +
        "Try asking more specific questions like 'How do I book an appointment?' or 'What features are available for business users?' " +
        "The quick actions below also provide immediate help for common tasks."
      );
    }
  }

  async getQuickActions(userRole, isAuthenticated) {
    const actions = {
      unauthenticated: [
        { label: "How to register?", query: "How do I create an account?" },
        { label: "Login help", query: "How do I login to the system?" },
        {
          label: "Business vs Customer",
          query:
            "What is the difference between business and customer accounts?",
        },
      ],
      customer: [
        {
          label: "Book appointment",
          query: "How do I book an appointment with a business?",
        },
        {
          label: "View my appointments",
          query: "Where can I see all my appointments?",
        },
        {
          label: "Cancel appointment",
          query: "How do I cancel or reschedule an appointment?",
        },
        { label: "Find businesses", query: "How do I search for businesses?" },
      ],
      business: [
        {
          label: "Set up time slots",
          query: "How do I create available time slots for customers?",
        },
        {
          label: "Manage appointments",
          query: "How do I view and manage customer appointments?",
        },
        {
          label: "Update appointment status",
          query: "How do I change the status of an appointment?",
        },
        {
          label: "View dashboard",
          query: "What information is available on the business dashboard?",
        },
      ],
    };

    if (!isAuthenticated) return actions.unauthenticated;
    return actions[userRole] || actions.unauthenticated;
  }

  async generateStepByStepGuide(task, context) {
    if (!this.available) {
      throw new Error(
        "AI service is not available. Please configure Gemini API key."
      );
    }

    const model = this.gemini.getGenerativeModel({ model: this.model });

    const prompt = `Generate a step-by-step guide for the following task in our appointment management system:

Task: ${task}
User Context: ${JSON.stringify(context)}

Format the response as:
1. Clear numbered steps
2. Each step should be specific and actionable
3. Include relevant page names or button labels
4. Mention any prerequisites
5. Keep it concise but complete

System Context: ${this.systemPrompt}

Guide:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Guide Generation Error:", error);
      throw new Error(
        "Failed to generate step-by-step guide. Please try again."
      );
    }
  }
}

module.exports = new AIService();
