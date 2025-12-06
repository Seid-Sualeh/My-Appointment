// import React from "react";

// const ThinkingBubble = () => {
//   return (
//     <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl rounded-bl-none max-w-xs">
//       <div className="flex space-x-1">
//         <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//         <div
//           className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//           style={{ animationDelay: "0.2s" }}
//         ></div>
//         <div
//           className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
//           style={{ animationDelay: "0.4s" }}
//         ></div>
//       </div>
//       <span className="text-sm text-blue-700 font-medium">Thinking...</span>
//     </div>
//   );
// };

// export default ThinkingBubble;










import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const ThinkingBubble = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl rounded-bl-none max-w-xs">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <div className="flex items-center">
        <SparklesIcon className="h-4 w-4 text-blue-600 mr-2" />
        <span className="text-sm text-blue-700 font-medium">
          Thinking with Gemini...
        </span>
      </div>
    </div>
  );
};

export default ThinkingBubble;