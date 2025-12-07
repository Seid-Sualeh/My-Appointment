// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import LoadingSpinner from "./LoadingSpinner";
// import { useSelector } from "react-redux";
// import "./Layout.css";

// const Layout = () => {
//   const { loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="layout">
//       <Header />
//       <main className="main-content">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector } from "react-redux";
import AIAssistant from "../../components/ai-assistant/AIAssistant";

const Layout = ({ children }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
