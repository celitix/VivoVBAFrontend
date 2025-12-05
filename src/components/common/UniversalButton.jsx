import React, { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

const UniversalButton = ({
    id,
    name,
    label,
    onClick,
    type = "button",
    variant = "primary",
    icon = null,
    disabled = false,
    isLoading = false,
    style,
    className,
}) => {
    const btnRef = useRef(null);
    const [ripples, setRipples] = useState([]);

    const getButtonStyles = () => {
        switch (variant) {
            case "primary":
                return `bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer`;
            case "secondary":
                return `bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md cursor-pointer`;
            case "success":
                return `bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white shadow-md hover:shadow-lg cursor-pointer`;
            case "danger":
                return `bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg cursor-pointer`;
            case "black":
                return `bg-gray-900 text-white hover:bg-black hover:shadow-xl hover:shadow-gray-600/30 border border-gray-800 shadow-md transition-all duration-300 cursor-pointer`;
            default:
                return `bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer`;
        }
    };


    const handleClick = (e) => {
        if (disabled || isLoading) return;

        const button = btnRef.current;
        const rect = button.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const newRipple = { x, y, size, key: Date.now() };

        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
        }, 600);

        if (onClick) onClick(e);
    };

    const loading = isLoading;

    return (
        <button
            id={id}
            name={name}
            ref={btnRef}
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            style={style}
            className={`
        relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 
        rounded-lg font-medium text-sm tracking-wide transition-all text-nowrap
        duration-300 ease-out active:scale-[0.97] ${className}
        ${getButtonStyles()}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
        >

            <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                {ripples.map((ripple) => (
                    <span
                        key={ripple.key}
                        className="absolute bg-white/40 rounded-full animate-ripple"
                        style={{
                            width: ripple.size,
                            height: ripple.size,
                            top: ripple.y,
                            left: ripple.x,
                        }}
                    />
                ))}
            </span>


            <div className="relative flex items-center justify-center">
                <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <CircularProgress size={18} thickness={5} color="inherit" />
                </span>

                <span
                    className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
                        }`}
                >
                    {icon && <span className="text-lg">{icon}</span>}
                    <span>{label}</span>
                </span>
            </div>
        </button>
    );
};

export default UniversalButton;
