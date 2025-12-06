// import React, { useState, useRef, useEffect } from "react";
// import useAIAssistant from "../../hooks/useAIAssistant";
// import ChatMessage from "./ChatMessage";
// import QuickActions from "./QuickActions";
// import ThinkingBubble from "./ThinkingBubble";
// import {
//   ChatBubbleLeftRightIcon,
//   XMarkIcon,
//   PaperAirplaneIcon,
//   ArrowsPointingOutIcon,
//   ArrowsPointingInIcon,
//   SparklesIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// const AIAssistant = () => {
//   const {
//     messages,
//     isLoading,
//     quickActions,
//     suggestions,
//     isMinimized,
//     setIsMinimized,
//     sendMessage,
//     quickActionClick,
//     suggestionClick,
//     clearChat,
//   } = useAIAssistant();

//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (!isMinimized) {
//       inputRef.current?.focus();
//     }
//   }, [isMinimized]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim() && !isLoading) {
//       sendMessage(input);
//       setInput("");
//     }
//   };

//   const handleQuickAction = (query) => {
//     quickActionClick(query);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     suggestionClick(suggestion);
//   };

//   if (isMinimized) {
//     return (
//       <button
//         onClick={() => setIsMinimized(false)}
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group"
//       >
//         <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
//         <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
//           <SparklesIcon className="h-3 w-3 text-white" />
//         </div>
//         <div className="absolute -bottom-12 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//           Open Assistant
//         </div>
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200">
//       {/* Header */}
//       <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
//         <div className="flex items-center">
//           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
//             <SparklesIcon className="h-6 w-6 text-white" />
//           </div>
//           <div>
//             <h3 className="font-bold text-white">AI Assistant</h3>
//             <p className="text-sm text-purple-100">Ready to help!</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={clearChat}
//             className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
//             title="Clear chat"
//           >
//             <TrashIcon className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setIsMinimized(true)}
//             className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
//             title="Minimize"
//           >
//             <ArrowsPointingInIcon className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setIsMinimized(true)}
//             className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
//             title="Close"
//           >
//             <XMarkIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50">
//         <div className="space-y-4">
//           {messages.map((message) => (
//             <ChatMessage key={message.id} message={message} />
//           ))}
//           {isLoading && <ThinkingBubble />}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Suggestions */}
//         {suggestions.length > 0 && messages.length <= 2 && (
//           <div className="mt-8">
//             <p className="text-sm font-medium text-gray-700 mb-3">
//               Try asking:
//             </p>
//             <div className="space-y-2">
//               {suggestions.slice(0, 3).map((suggestion, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleSuggestionClick(suggestion)}
//                   className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Quick Actions */}
//       {quickActions.length > 0 && (
//         <div className="px-6 pt-4 pb-2 border-t border-gray-200 bg-white flex-shrink-0">
//           <QuickActions
//             actions={quickActions}
//             onClick={handleQuickAction}
//             isLoading={isLoading}
//           />
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
//         <form onSubmit={handleSubmit} className="flex items-center space-x-3">
//           <div className="flex-1 relative">
//             <input
//               ref={inputRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask me anything about the appointment system..."
//               className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={isLoading}
//             />
//             <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//               <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <button
//               type="submit"
//               disabled={!input.trim() || isLoading}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <PaperAirplaneIcon className="h-5 w-5" />
//             </button>
//           </div>
//         </form>
//         <p className="text-xs text-gray-500 mt-3 text-center">
//           I can help with registration, booking, management, and troubleshooting
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AIAssistant;









import React, { useState, useRef, useEffect } from "react";
import useAIAssistant from "../../hooks/useAIAssistant";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";
import ThinkingBubble from "./ThinkingBubble";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SparklesIcon,
  TrashIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/24/outline";

const AIAssistant = () => {
  const {
    messages,
    isLoading,
    quickActions,
    suggestions,
    isMinimized,
    aiStatus,
    setIsMinimized,
    sendMessage,
    quickActionClick,
    suggestionClick,
    clearChat,
  } = useAIAssistant();

  const [input, setInput] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMinimized]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleQuickAction = (query) => {
    quickActionClick(query);
  };

  const handleSuggestionClick = (suggestion) => {
    suggestionClick(suggestion);
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case "connected":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case "connected":
        return "AI Connected";
      case "error":
        return "AI Limited";
      default:
        return "Connecting...";
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300"
      >
        {aiStatus === "connected" ? (
          <SparklesIcon className="h-7 w-7 text-white animate-pulse" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
        )}

        {/* Status indicator */}
        <div
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            aiStatus === "connected"
              ? "bg-green-500"
              : aiStatus === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        ></div>

        <div className="absolute -bottom-12 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Open Assistant {aiStatus === "connected" ? "🤖" : "⚠️"}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            {aiStatus === "connected" ? (
              <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
            ) : (
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">AI Assistant</h3>
            <div className="flex items-center">
              <span className="text-sm text-purple-100">{getStatusText()}</span>
              <button
                onClick={() => setShowStatus(!showStatus)}
                className="ml-2 text-xs text-purple-200 hover:text-white"
              >
                {showStatus ? "Hide" : "Details"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearChat}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Clear chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize"
          >
            <ArrowsPointingInIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status Details */}
      {showStatus && (
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {aiStatus === "connected" ? (
                <SignalIcon className={`h-4 w-4 ${getStatusColor()} mr-2`} />
              ) : (
                <SignalSlashIcon
                  className={`h-4 w-4 ${getStatusColor()} mr-2`}
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {aiStatus === "connected" ? "Google Gemini" : "Limited Mode"}
              </span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
              {aiStatus === "connected" ? "Full AI" : "Basic Help"}
            </span>
          </div>
          {aiStatus === "error" && (
            <p className="text-xs text-gray-600 mt-1">
              AI features temporarily limited. Basic guidance available.
            </p>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <ThinkingBubble />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && messages.length <= 2 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Try asking:
            </p>
            <div className="space-y-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="px-6 pt-4 pb-2 border-t border-gray-200 bg-white">
          <QuickActions
            actions={quickActions}
            onClick={handleQuickAction}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the appointment system..."
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={isLoading || aiStatus === "error"}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || aiStatus === "error"}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {aiStatus === "connected"
            ? "Powered by Google Gemini AI • Ask me about registration, booking, and management"
            : "Basic guidance mode • AI features temporarily limited"}
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;