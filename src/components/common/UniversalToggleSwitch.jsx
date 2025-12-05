import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import CustomTooltip from "./CustomTooltip";

const colorMap = {
  blue: "bg-blue-600",
  green: "bg-green-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

const UniversalToggleSwitch = ({
  label = "",
  defaultChecked = false,
  onChange,
  color = "blue",
  size = "md",
  error = false,
  errorText = "",
  tooltipContent = "",
  tooltipPlacement = "top",
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !checked;
    setChecked(newState);
    onChange?.(newState);
  };

  // size variants
  const sizeClasses = {
    sm: {
      width: "w-12",
      height: "h-7",
      circle: "w-5 h-5 left-0.5",
      translate: "translate-x-6",
      icon: "w-3 h-3",
    },
    md: {
      width: "w-16",
      height: "h-9",
      circle: "w-7 h-7 left-1",
      translate: "translate-x-7",
      icon: "w-4 h-4",
    },
    lg: {
      width: "w-20",
      height: "h-11",
      circle: "w-9 h-9 left-1.5",
      translate: "translate-x-9",
      icon: "w-5 h-5",
    },
  };

  const current = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col font-[Poppins]">
      {/* Label & Tooltip */}
      {label && (
        <div className="flex items-center gap-1 mb-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {tooltipContent && (
            <CustomTooltip title={tooltipContent} placement={tooltipPlacement} arrow>
              <span>
                <AiOutlineInfoCircle className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors" />
              </span>
            </CustomTooltip>
          )}
        </div>
      )}

      {/* Toggle Switch */}
      <div
        onClick={handleToggle}
        className={`relative ${current.width} ${current.height} rounded-full transition-colors duration-300 cursor-pointer 
        ${checked ? colorMap[color] || colorMap.blue : "bg-gray-300"}
        ${error ? "ring-2 ring-red-400" : ""}
        `}
      >
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center
          text-${color === "orange" ? "orange-500" : color + "-500"}
          transition-all duration-300 ${checked ? current.translate : ""}
          ${current.circle} shadow-md`}
        >
          {/* Check Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`${current.icon} transition-all ${checked ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Error Text */}
      {error && errorText && (
        <p className="mt-1 text-xs text-red-500 font-medium animate-fadeIn">{errorText}</p>
      )}
    </div>
  );
};

export default UniversalToggleSwitch;

