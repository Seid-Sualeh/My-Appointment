import React, { useState } from "react";
import {
  CalendarDaysIcon,
  UserPlusIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const QuickActions = ({ actions, onClick, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (label) => {
    if (label.includes("appointment") || label.includes("book")) {
      return <CalendarDaysIcon className="h-4 w-4 mr-2" />;
    }
    if (label.includes("register") || label.includes("account")) {
      return <UserPlusIcon className="h-4 w-4 mr-2" />;
    }
    if (label.includes("time slot")) {
      return <ClockIcon className="h-4 w-4 mr-2" />;
    }
    if (label.includes("business")) {
      return <BuildingStorefrontIcon className="h-4 w-4 mr-2" />;
    }
    if (label.includes("cancel") || label.includes("reschedule")) {
      return <XCircleIcon className="h-4 w-4 mr-2" />;
    }
    if (label.includes("search") || label.includes("find")) {
      return <MagnifyingGlassIcon className="h-4 w-4 mr-2" />;
    }
    return <CalendarDaysIcon className="h-2 w-4 mr-2" />;
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onClick(action.query)}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getIcon(action.label)}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickActions;
