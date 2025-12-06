const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport"); // Used for Social Auth/JWT verification

// Load environment variables
dotenv.config();

// Import passport configuration (ensures strategies are loaded)
require("./config/passport");

// Import routes
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const businessRoutes = require("./routes/business");
const customerRoutes = require("./routes/customer");

const aiRoutes = require("./routes/ai");

// Initialize express
const app = express();

// --- Middleware Setup ---
app.use(helmet()); // Security headers

// CORS configuration - allow multiple origins in development
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL].filter(Boolean)
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        process.env.CLIENT_URL,
      ].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow any localhost origin
      if (
        process.env.NODE_ENV === "development" &&
        (origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:"))
      ) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev")); // Logging
app.use(express.json()); // Body parsing for JSON
app.use(express.urlencoded({ extended: true })); // Body parsing for form data
app.use(passport.initialize()); // Initialize Passport middleware

// Add AI routes after body parser middleware
app.use("/api/ai", aiRoutes);

// --- Database Connection ---
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Deprecated in modern Mongoose, but kept for context
    useUnifiedTopology: true, // Deprecated in modern Mongoose, but kept for context
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
//

// --- Routes Setup ---
// The /api/auth route handles the register function defined below
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test route to check body parsing
app.post("/test-body", (req, res) => {
  console.log("Received body:", req.body);
  res.json({
    success: true,
    received: req.body,
    timestamp: new Date().toISOString(),
  });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

let currentServer = null;

const startServer = (port) => {
  currentServer = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  currentServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Trying alternative ports...`
      );

      // Try a few alternative ports
      const alternativePorts = [5001, 5002, 5003, 5004, 5005];
      const availablePorts = alternativePorts.filter((p) => p !== port);

      if (availablePorts.length === 0) {
        console.error(
          "No available ports found. Please free up port 5000 or configure a different PORT in environment variables."
        );
        process.exit(1);
        return;
      }

      // Try the first available alternative port
      const nextPort = availablePorts[0];
      console.log(`Attempting to start server on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error("Server error:", error);
      process.exit(1);
    }
  });
};

startServer(PORT);

module.exports = app;
