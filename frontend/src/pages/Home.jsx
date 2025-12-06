// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "./Home.css";

// const Home = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   return (
//     <div className="home">
//       <section className="hero">
//         <div className="hero-content">
//           <h1>Welcome to AppointmentHub</h1>
//           <p>Streamline your appointment booking and management process</p>

//           {!isAuthenticated ? (
//             <div className="hero-actions">
//               <Link to="/register" className="btn-primary">
//                 Get Started
//               </Link>
//               <Link to="/login" className="btn-secondary">
//                 Sign In
//               </Link>
//             </div>
//           ) : (
//             <div className="hero-actions">
//               <Link to="/dashboard" className="btn-primary">
//                 Go to Dashboard
//               </Link>
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="features">
//         <div className="container">
//           <h2>Why Choose AppointmentHub?</h2>
//           <div className="features-grid">
//             <div className="feature-card">
//               <h3>Easy Booking</h3>
//               <p>Book appointments with just a few clicks</p>
//             </div>
//             <div className="feature-card">
//               <h3>Business Management</h3>
//               <p>Manage your business appointments efficiently</p>
//             </div>
//             <div className="feature-card">
//               <h3>Real-time Updates</h3>
//               <p>Get instant notifications about your appointments</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import {
//   CalendarDaysIcon,
//   ClockIcon,
//   BellAlertIcon,
//   ChartBarIcon,
//   DevicePhoneMobileIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react";


import {
  CalendarDaysIcon,
  ClockIcon,
  BellAlertIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import AIAssistant from "../components/ai-assistant/AIAssistant";


const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: CalendarDaysIcon,
      title: "Smart Calendar",
      description:
        "Interactive calendar with real-time availability and easy scheduling.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: ClockIcon,
      title: "Time Management",
      description:
        "Efficient time slot management for businesses and convenient booking for customers.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: BellAlertIcon,
      title: "Smart Reminders",
      description:
        "Automatic email reminders to reduce no-shows and keep everyone informed.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: ChartBarIcon,
      title: "Business Analytics",
      description:
        "Comprehensive dashboard with insights and reports for business growth.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Mobile Friendly",
      description:
        "Fully responsive design that works perfectly on all devices.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with reliable performance you can count on.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Salon Owner",
      content:
        "This system has transformed how we manage appointments. Our no-show rate dropped by 70%!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Dental Clinic Manager",
      content:
        "The automated reminders alone saved us hours of administrative work each week.",
      avatar: "MC",
    },
    {
      name: "Emma Davis",
      role: "Consultant",
      content:
        "My clients love the easy booking process. It has made my business much more efficient.",
      avatar: "ED",
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Appointments
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Efficient appointment management for businesses and customers.
            Schedule, manage, and track appointments with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl shadow-lg transition-all"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make appointment management simple and
            effective.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
            >
              <div
                className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
              >
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to transform your appointment management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Sign Up & Set Up",
              description:
                "Register as a business or customer. Businesses set their available time slots and services.",
            },
            {
              step: "02",
              title: "Book & Manage",
              description:
                "Customers browse and book appointments. Businesses manage their schedule and confirmations.",
            },
            {
              step: "03",
              title: "Stay Updated",
              description:
                "Automatic reminders keep everyone informed. Analytics help businesses grow.",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-600 mx-auto mb-6 shadow-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join hundreds of businesses that trust our platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Appointment Management?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of businesses and customers who have simplified their
          scheduling process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent text-white border-2 border-white text-lg font-semibold rounded-xl hover:bg-white/10 shadow-lg hover:shadow-xl transition-all"
              >
                Schedule a Demo
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
        <p className="mt-6 text-blue-200 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      <AIAssistant />
    </div>
  );
};

export default Home;
