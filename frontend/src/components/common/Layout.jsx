

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector } from "react-redux";
import AIAssistant from "../../components/ai-assistant/AIAssistant";

const Layout = ({ children }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? <LoadingSpinner /> : children}
      </main>
      <Footer />
      {/* Global AI Assistant - appears on all pages */}
      <AIAssistant />
    </div>
  );
};

export default Layout;
