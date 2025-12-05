import React from "react";

const UniversalRadioButton = ({
  name = "radio",
  value = "",
  checked = false,
  onChange = () => { },
  label = "",
  className = "",
  size = "md", // sm | md | lg
  variant = "primary", // primary | success | danger | custom
  ...props
}) => {
  const variants = {
    primary: "border-blue-500 text-blue-500 border-5",
    success: "border-green-500 text-green-500 border-5",
    danger: "border-red-500 text-red-500 border-5",
    custom: "",
  };

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const getBorderWidth = () => {
    if (size === "sm") return checked ? "border-[3px]" : "border-[2px]";
    if (size === "md") return checked ? "border-[4px]" : "border-[3px]";
    if (size === "lg") return checked ? "border-[5px]" : "border-[4px]";
    return "border-[3px]";
  };

  return (
    <label
      className={`flex items-center gap-2 w-max cursor-pointer select-none ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
        {...props}
      />
      <span
        className={`relative flex items-center justify-center rounded-full border-2 ${sizes[size]
          }  ${getBorderWidth()} ${checked ? variants[variant] : "border-gray-400"
          } transition-all duration-100 `}
      >
        {checked && (
          <span
            className={`absolute rounded-full ${size === "lg"
                ? "w-2.5 h-2.5"
                : size === "sm"
                  ? "w-1.5 h-1.5"
                  : "w-2 h-2"
              } ${checked ? variants[variant].split(" ")[1] : "bg-gray-400"}`}
          />
        )}
      </span>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
};

export default UniversalRadioButton;
