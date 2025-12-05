import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai"; 
const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav
      className={`text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">
                {item.label}
              </span>
            )}

            {/* Separator */}
            {index < items.length - 1 && (
              <AiOutlineRight className="mx-2 text-gray-400 text-xs" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
