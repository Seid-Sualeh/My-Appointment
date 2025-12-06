import React from "react";

const ThinkingBubble = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl rounded-bl-none max-w-xs">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <span className="text-sm text-blue-700 font-medium">Thinking...</span>
    </div>
  );
};

export default ThinkingBubble;
