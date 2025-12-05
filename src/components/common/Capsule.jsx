import React from "react";
import { motion } from "framer-motion";

// --- Color Variants ---
// const variantStyles = {
//   primary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
//   secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
//   success: "bg-green-100 text-green-700 hover:bg-green-200",
//   warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
//   danger: "bg-red-100 text-red-700 hover:bg-red-200",
// };
const variantStyles = {
  primary: "bg-indigo-100 text-indigo-700",
  secondary: "bg-slate-100 text-slate-700",
  success: "bg-green-100 text-green-700 ",
  warning: "bg-yellow-100 text-yellow-700 ",
  danger: "bg-red-100 text-red-700 ",
};

const Capsule = ({
  icon: Icon,
  label,
  value,
  variant = "primary",
  className = "",
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
        transition-all duration-200 cursor-pointer select-none
        ${variantStyles[variant] || variantStyles.primary} ${className}
      `}
    >
      {/* Left Icon */}
      {Icon && <Icon size={16} className="shrink-0" />}

      {/* Label */}
      <span>{label}</span>

      {/* Value Badge (if exists) */}
      {value !== undefined && (
        <span
          className={`
            text-xs font-semibold px-2 py-0.5 rounded-full ml-1
            ${variant === "primary" && "bg-indigo-200 text-indigo-800"}
            ${variant === "secondary" && "bg-slate-200 text-slate-800"}
            ${variant === "success" && "bg-green-200 text-green-800"}
            ${variant === "warning" && "bg-yellow-200 text-yellow-800"}
            ${variant === "danger" && "bg-red-200 text-red-800"}
          `}
        >
          {value}
        </span>
      )}
    </motion.div>
  );
};

export default Capsule;
