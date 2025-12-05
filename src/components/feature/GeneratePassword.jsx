import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AiOutlineInfoCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CustomTooltip from "../common/CustomTooltip";
import UniversalButton from "../common/UniversalButton";

const GeneratePassword = ({
  label,
  id,
  name,
  tooltipContent = "",
  tooltipPlacement = "top",
  value,
  onChange,
  readOnly = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const generateRandomPassword = (length = 8) => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return generated;
  };

  // ✅ Allow generation when readOnly, only block if disabled
  const handleGeneratePassword = () => {
    if (disabled) return;
    const newPassword = generateRandomPassword();
    onChange(newPassword);
  };

  const handleCopyPassword = () => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success("Password copied to clipboard!"))
      .catch(() => toast.error("Failed to copy password."));
  };

  const handleChange = (e) => {
    if (readOnly || disabled) return;
    onChange(e.target.value);
  };

  const isInputLocked = readOnly || disabled; // for styling convenience

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {tooltipContent && (
            <CustomTooltip title={tooltipContent} placement={tooltipPlacement} arrow>
              <span>
                <AiOutlineInfoCircle className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </span>
            </CustomTooltip>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Input Field */}
        <div
          className={`flex items-center flex-1 border rounded-md shadow ${isInputLocked ? "bg-gray-100 border-gray-200" : "border-gray-300"
            }`}
        >
          <input
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={disabled}
            className={`flex-1 p-1.5 h-[2.10rem] focus:outline-none text-sm ${isInputLocked ? "cursor-not-allowed bg-gray-100" : ""
              }`}
            placeholder="Your password"
          />
          <div
            onClick={!disabled ? handleTogglePassword : undefined}
            className={`pr-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </div>
        </div>

        {/* Copy Password Button */}
        <CustomTooltip title="Copy password" placement="top" arrow>
          <button
            onClick={handleCopyPassword}
            disabled={disabled}
            className={`p-1 bg-transparent rounded-full shadow-2xl focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200 cursor-pointer"
              }`}
          >
            <ContentCopyOutlinedIcon sx={{ fontSize: "1.2rem", color: "#999" }} />
          </button>
        </CustomTooltip>

        {/* Generate Password Button */}
        <UniversalButton
          onClick={handleGeneratePassword}
          label="Generate Password"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default GeneratePassword;
