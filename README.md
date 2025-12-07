# Appointment Management System

A comprehensive full-stack appointment management system with AI-powered features, built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### **Core Features**

- **User Authentication**: Secure registration, login, and social authentication (Google, Facebook)
- **Role-Based Access**: Business owners, customers, and administrators
- **Appointment Management**: Create, view, update, and cancel appointments
- **Calendar Integration**: Interactive calendar views with FullCalendar
- **Business Management**: Business profile setup and management
- **Email Notifications**: Automated appointment reminders and confirmations
- **AI Assistant**: AI-powered appointment scheduling and customer support

### **AI Features**

- **Smart Scheduling**: AI-powered appointment recommendations
- **Natural Language Processing**: Chat interface for appointment management
- **Automated Reminders**: Intelligent reminder system
- **Context-Aware Assistance**: AI understands appointment context

## 📁 Project Structure

```
appointment-management-system/
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Authentication & validation
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Main server file
│   └── package.json
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── components/       # React components
    │   │   ├── ai-assistant/ # AI assistant components
    │   │   ├── appointments/ # Appointment components
    │   │   ├── auth/         # Authentication components
    │   │   ├── calendar/     # Calendar components
    │   │   ├── common/       # Shared components
    │   │   └── dashboard/    # Dashboard components
    │   ├── context/          # React context providers
    │   ├── hooks/            # Custom hooks
    │   ├── pages/            # Page components
    │   ├── services/         # API services
    │   ├── store/            # Redux store
    │   └── utils/            # Utility functions
    ├── App.jsx               # Main app component
    ├── main.jsx              # Entry point
    └── package.json
```

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI, Tailwind CSS
- **Form Handling**: React Hook Form with Yup validation
- **Routing**: React Router v6
- **Calendar**: FullCalendar
- **Icons**: Heroicons
- **Build Tool**: Vite
- **AI Integration**: OpenAI API

### **Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js (Google, Facebook OAuth)
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer
- **AI**: OpenAI SDK
- **Scheduling**: Node-cron for automated tasks
- **Logging**: Morgan

## 📦 Key Dependencies

### **Frontend Dependencies**

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@reduxjs/toolkit": "^1.9.5",
  "@mui/material": "^5.14.8",
  "@fullcalendar/react": "^6.1.9",
  "axios": "^1.5.0",
  "react-router-dom": "^6.15.0"
}
```

### **Backend Dependencies**

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "jsonwebtoken": "^9.0.2",
  "passport": "^0.6.0",
  "openai": "^6.10.0",
  "nodemailer": "^6.9.7",
  "node-cron": "^3.0.2"
}
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- OpenAI API key (for AI features)
- Google/Facebook OAuth credentials (for social login)

### **Environment Variables**

Create `.env` files in both `backend/` and `frontend/` directories:

#### **Backend `.env`**

```env
MONGODB_URI=mongodb://localhost:27017/appointment-system
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OPENAI_API_KEY=your_openai_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
CLIENT_URL=http://localhost:5173
PORT=5000
```

#### **Frontend `.env`**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo/appointment-management-system.git
   cd appointment-management-system
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### **Running the Application**

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

## 🔧 Development Workflow

### **Available Scripts**

#### **Backend**

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run cron    # Run appointment reminder cron job
```

#### **Frontend**

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### **Code Structure**

- **Frontend**: Uses React functional components with hooks
- **Backend**: Follows MVC pattern with Express routes and controllers
- **State Management**: Redux for global state, React context for theme
- **API Communication**: Axios with centralized API service

## 📱 User Roles

- **Customer**: Can book, view, and manage their appointments
- **Business Owner**: Can manage business profile, time slots, and appointments
- **Administrator**: Full system access and user management

## 🤖 AI Features

The system includes an AI assistant that provides:

- **Smart appointment scheduling** based on availability and preferences
- **Natural language interface** for appointment management
- **Context-aware assistance** understanding user intent
- **Automated reminders** with intelligent timing

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password hashing** using bcrypt
- **Input validation** with Express Validator
- **Rate limiting** to prevent brute force attacks
- **CORS configuration** for secure API access
- **Helmet middleware** for security headers

## 📊 Database Models

- **User**: Stores user authentication and profile data
- **Business**: Business information and settings
- **Appointment**: Appointment details and status
- **TimeSlot**: Available time slots for businesses

## 🌐 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth

### **Appointments**

- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### **Business**

- `GET /api/business` - Get business information
- `POST /api/business` - Create/update business
- `GET /api/business/timeslots` - Get available time slots

### **AI Assistant**

- `POST /api/ai/chat` - AI chat interface
- `POST /api/ai/schedule` - Smart scheduling

## 🎨 UI Components

- **Responsive Design**: Mobile-friendly interface
- **Theme Switching**: Light/dark mode support
- **Interactive Calendar**: Drag-and-drop appointment management
- **Real-time Updates**: Instant feedback and notifications

## 🚀 Deployment

### **Production Build**

```bash
# Frontend build
cd frontend
npm run build

# Backend production
cd backend
npm start
```

### **Environment Configuration**

Ensure all environment variables are set in production with proper security measures.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

## 📧 Contact

For support or questions, please contact the development team.

---

**Built with ❤️ by SEID SUALEH**
