import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineInfoCircle, AiOutlineLeft, } from "react-icons/ai";
import { RiArrowRightWideLine } from "react-icons/ri";
import { RiArrowLeftWideFill } from "react-icons/ri";
import CustomTooltip from "./CustomTooltip";

const colorMap = {
  blue: "text-blue-600 border-blue-600",
  green: "text-green-600 border-green-600",
  red: "text-red-500 border-red-500",
  purple: "text-purple-600 border-purple-600",
  orange: "text-orange-500 border-orange-500",
  indigo: "text-indigo-800 border-indigo-500",
};

const UniversalTabs = ({
  label = "",
  color = "blue",
  value,
  defaultIndex = 0,
  onChange,
  error = false,
  errorText = "",
  tooltipContent = "",
  tooltipPlacement = "top",
  className = "",
  children,
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const currentIndex = value !== undefined ? value : internalIndex;
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scrollRef = useRef(null);

  const handleTabClick = (index) => {
    if (value === undefined) setInternalIndex(index);
    onChange?.(index);
  };

  const activeColor = colorMap[color] || colorMap.blue;
  const tabs = React.Children.toArray(children);

  // 👇 Scroll button logic
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  const scrollTabs = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 150;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <div className={`w-full font-[Poppins] relative ${className}`}>
      {/* Label + Tooltip */}
      {label && (
        <div className="flex items-center gap-1 mb-2">
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

      {/* Tabs Header with Scroll Buttons */}
      <div className="relative flex items-center">
        {showLeft && (
          <button
            onClick={() => scrollTabs("left")}
            className="absolute -left-1 z-10  shadow-md rounded-full p-1 bg-blue-100 text-gray-500 hover:text-gray-700"
          >
            <RiArrowLeftWideFill />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex border-b overflow-x-auto scrollbar-hide scroll-smooth ${error ? "border-red-400" : "border-gray-200"
            }`}
          style={{ scrollBehavior: "smooth" }}
        >
          {tabs.map((tab, index) => {
            const { label: tabLabel, icon } = tab.props;
            return (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-t-md
                  ${currentIndex === index
                    ? `${activeColor} bg-gray-50 border-b-2`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {icon && <span className="text-base">{icon}</span>}
                <span>{tabLabel}</span>
                {currentIndex === index && (
                  <motion.div
                    layoutId="tab-underline"
                    className={`absolute bottom-0 left-0 right-0 h-[2px] ${activeColor}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {showRight && (
          <button
            onClick={() => scrollTabs("right")}
            className="absolute -right-1 z-10 bg-blue-100 shadow-md rounded-full p-1 text-gray-500 hover:text-gray-700"
          >
            <RiArrowRightWideLine />
          </button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-xs text-red-500 font-medium"
          >
            {errorText}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Active Tab Content */}
      <div className="mt-4 min-h-[60px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {tabs[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UniversalTabs;
