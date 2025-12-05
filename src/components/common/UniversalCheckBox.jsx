import React from "react";

const UniversalCheckBox = ({
  checked = false,
  onChange = () => { },
  label = "",
  className = "",
  size = "md", // sm | md | lg
  variant = "success", // success | danger | warning | primary | custom
  ...props
}) => {
  // Variant colors
  const variants = {
    success: "bg-green-500 border-green-500",
    danger: "bg-red-500 border-red-500",
    warning: "bg-yellow-500 border-yellow-500",
    primary: "bg-blue-500 border-blue-500",
    custom: "",
  };

  // Sizes
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <label
      className={`flex items-center gap-2 w-max cursor-pointer select-none ${className}`}
    >
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
        {...props}
      />

      {/* Custom checkbox box */}
      <span
        className={`${sizes[size]
          } flex items-center justify-center rounded-md border-2 transition-all duration-200 ${checked ? variants[variant] : "border-gray-400 bg-white"
          }`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
            width={size === "lg" ? 22 : size === "sm" ? 14 : 18}
            height={size === "lg" ? 22 : size === "sm" ? 14 : 18}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {/* Optional label */}
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
};

export default UniversalCheckBox;
