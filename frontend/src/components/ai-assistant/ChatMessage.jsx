import React from "react";
import { UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  const isGuide = message.type === "guide";

  const formatContent = (content) => {
    // Convert markdown-like formatting
    return content.split("\n").map((line, index) => {
      if (line.match(/^\d+\./)) {
        return (
          <p key={index} className="my-1 ml-4">
            {line}
          </p>
        );
      }
      if (line.match(/^[•\-]/)) {
        return (
          <p key={index} className="my-1 ml-6 flex items-start">
            <span className="mr-2">•</span>
            {line.substring(1)}
          </p>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {line.substring(2, line.length - 2)}
          </strong>
        );
      }
      return (
        <p key={index} className="my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gradient-to-r from-purple-500 to-purple-600"
            }`}
          >
            {isUser ? (
              <UserIcon className="h-5 w-5 text-white" />
            ) : (
              <Cog6ToothIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
              : isGuide
              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-bl-none"
              : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-bl-none"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {formatContent(message.content)}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-2 ${
              isUser ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
