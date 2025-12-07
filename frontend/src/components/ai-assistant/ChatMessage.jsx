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







// import React from "react";
// import {
//   UserIcon,
//   Cog6ToothIcon,
//   SparklesIcon,
// } from "@heroicons/react/24/outline";

// const ChatMessage = ({ message }) => {
//   const isUser = message.sender === "user";
//   const isGuide = message.type === "guide";
//   const isError = message.type === "error";

//   const formatContent = (content) => {
//     // Split by lines and format
//     return content.split("\n").map((line, index) => {
//       // Check for numbered steps (1., 2., etc.)
//       if (line.match(/^\d+\.\s+/)) {
//         return (
//           <div key={index} className="flex items-start my-2 ml-4">
//             <span className="font-bold mr-2 text-blue-600">
//               {line.match(/^\d+/)[0]}.
//             </span>
//             <span>{line.replace(/^\d+\.\s+/, "")}</span>
//           </div>
//         );
//       }

//       // Check for bullet points
//       if (line.match(/^[•\-]\s/)) {
//         return (
//           <div key={index} className="flex items-start my-1 ml-6">
//             <span className="mr-2 text-gray-500">•</span>
//             <span>{line.substring(2)}</span>
//           </div>
//         );
//       }

//       // Check for bold text (handling simple **bold** format)
//       const boldRegex = /\*\*(.*?)\*\*/g;
//       const parts = line.split(boldRegex);
//       if (parts.length > 1) {
//         return (
//           <p key={index} className="my-2">
//             {parts.map((part, i) =>
//               i % 2 === 1 ? (
//                 <strong key={i} className="font-semibold text-gray-900">
//                   {part}
//                 </strong>
//               ) : (
//                 part
//               )
//             )}
//           </p>
//         );
//       }

//       // Regular paragraph
//       return (
//         <p key={index} className="my-2">
//           {line}
//         </p>
//       );
//     });
//   };

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
//         {/* Avatar */}
//         <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center ${
//               isUser
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600"
//                 : isError
//                 ? "bg-gradient-to-r from-red-500 to-red-600"
//                 : "bg-gradient-to-r from-purple-500 to-purple-600"
//             }`}
//           >
//             {isUser ? (
//               <UserIcon className="h-5 w-5 text-white" />
//             ) : isError ? (
//               <Cog6ToothIcon className="h-5 w-5 text-white" />
//             ) : (
//               <SparklesIcon className="h-5 w-5 text-white" />
//             )}
//           </div>
//         </div>

//         {/* Message Content */}
//         <div
//           className={`rounded-2xl px-4 py-3 ${
//             isUser
//               ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
//               : isError
//               ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-bl-none"
//               : isGuide
//               ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-bl-none"
//               : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-bl-none"
//           }`}
//         >
//           <div className="prose prose-sm max-w-none">
//             {formatContent(message.content)}
//           </div>

//           {/* Timestamp and Service */}
//           <div
//             className={`flex justify-between items-center mt-2 text-xs ${
//               isUser ? "text-blue-200" : "text-gray-500"
//             }`}
//           >
//             <span>
//               {message.timestamp.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </span>
//             {!isUser && message.service && (
//               <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
//                 {message.service}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;