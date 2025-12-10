import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronsRight } from "react-icons/fi";
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  Building,
  Settings,
  Users,
  LogOut,
  CircleChevronRight,
  CircleChevronLeft,
} from "lucide-react";
import { FaCircle } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { useRoleContext } from "@/context/currentRoleContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { currentRole } = useRoleContext()

  const handleLogout = async () => {
    try {
      toast.success("Logged out successfully!");
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Something went wrong while logging out.");
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  const menu = [
    // {
    //   id: "1",
    //   name: "dashboard",
    //   label: "Dashboard",
    //   icon: LayoutDashboard,
    //   type: "single",
    //   path: "/",
    // },
    // {
    //   id: "6",
    //   label: "User Management",
    //   name: "user-management",
    //   icon: Users,
    //   type: "dropdown",
    //   subMenu: [
    //     { label: "Manage user", path: "/manageuser" },
    //     // { label: "Admins", path: "/users/admins" },
    //   ],
    // },
    {
      id: "1",
      name: "dashboard",
      label: "Dashboard",
      icon: FileSpreadsheet,
      type: "single",
      path: "/",
      role: ["admin", "user"]
    },
    {
      id: "2",
      name: "user-management",
      label: "User Management",
      icon: Users,
      type: "single",
      path: "/manageuser",
      role: ["admin"]
    },
    // {
    //   id: "3",
    //   name: "surveyform",
    //   label: "Survey Report",
    //   icon: FileSpreadsheet,
    //   type: "single",
    //   path: "/surveyformreport",
    //   role: ["admin"]
    // },
    {
      id: "3",
      name: "surveyform",
      label: "Survey Report",
      icon: FileSpreadsheet,
      type: "single",
      path: "/surveyformreportall",
      role: ["admin"]
    },
    {
      id: "4",
      name: "manageModels",
      label: "Manage Models",
      icon: HiDevicePhoneMobile,
      type: "single",
      path: "/managemodels",
      role: ["admin"]
    },
    {
      id: "5",
      name: "surveyForm",
      label: "Survey Report",
      icon: FileSpreadsheet,
      type: "single",
      path: "/surveyformuser",
      role: ["user"]
    },
    {
      id: "9",
      name: "logout",
      label: "Logout",
      icon: LogOut,
      type: "single",
      onClick: handleLogout,
      role: ["admin", "user"]
    },
  ];

  const filteredMenu = menu.filter(item =>
    item.role?.includes(currentRole)
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onToggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDropdownClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isActiveRoute = (path) => location.pathname === path;
  const handleLinkClick = (parentIndex) => {
    if (windowWidth < 768) {
      // Close sidebar always on mobile
      setIsOpen(false);

      // Keep dropdown open if the clicked route belongs to the currently open one
      if (openDropdown !== parentIndex) {
        setOpenDropdown(null);
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4.5 md:-right-5.5 -right-12 z-99 bg-indigo-100 rounded-full cursor-pointer">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg"
        >
          {isOpen ? (
            <CircleChevronLeft className="w-6 h-6 text-indigo-700" />
          ) : (
            <CircleChevronRight className="w-6 h-6 text-indigo-700" />
          )}
        </button>

      </div>
      <motion.div
        className={`
    sticky top-0 h-[95vh] shrink-0 flex flex-col  bg-white 
    shadow-sm mt-4 transition-all duration-500 ease-in-out
            `}
        style={{
          position: windowWidth < 768 ? "absolute" : "sticky",
          width:
            windowWidth < 768
              ? isOpen
                ? "235px" // mobile open
                : "0px" // mobile closed
              : isOpen
                ? "235px" // desktop open
                : "75px", // desktop collapsed
          left: 0,
          top: 50,
          height: "100vh",
          zIndex: 50, // ensures sidebar overlays content on mobile
        }}
      >

        {/* Title Section */}
        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto height-cal scrollbar-hide px-2 mb-0 md:mb-18">
          {filteredMenu.map((item, index) => {
            const Icon = item.icon;

            const isActive =
              isActiveRoute(item.path) ||
              item.subMenu?.some((sub) => isActiveRoute(sub.path));
            const isExpanded = openDropdown === index;

            return (
              <motion.div layout key={index} className="group relative">
                {/* SINGLE ITEM */}
                {item.type === "single" ? (
                  item.path ? (
                    // Normal navigation item
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      <div
                        className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                          }`}
                      >
                        <Icon size={20} />
                      </div>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </Link>
                  ) : (
                    // Clickable action (like logout)
                    <button
                      onClick={item.onClick}
                      className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      <div
                        className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                          }`}
                      >
                        <Icon size={20} />
                      </div>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </button>
                  )
                ) : (
                  /* DROPDOWN ITEM */
                  <>
                    <div
                      onClick={() => handleDropdownClick(index)}
                      className={`relative flex w-full items-center rounded-md py-3 transition-all duration-200 ${isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      <div
                        className={`grid place-content-center text-lg shrink-0 transition-all duration-300 ${isOpen ? "w-10 ml-2.5" : "w-15"
                          }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span
                              key={item.name}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden whitespace-nowrap font-medium ml-1 text-sm"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.div
                              key={`${item.name}-arrow`}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                rotate: isExpanded ? 180 : 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                type: "spring",
                                stiffness: 150,
                                damping: 15,
                              }}
                              className="mr-2"
                            >
                              <FiChevronDown />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Dropdown List */}
                    <AnimatePresence initial={false}>
                      {isExpanded && isOpen && (
                        <motion.div
                          key="submenu-wrapper"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.4, 0, 0.2, 1], // smoother cubic-bezier
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: -5 }}
                            animate={{ y: 0 }}
                            exit={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            className=" mt-1 flex flex-col space-y-1"
                          >
                            {item.subMenu.map((sub, i) => (
                              <Link
                                key={i}
                                to={sub.path}
                                onClick={() => handleLinkClick(index)}
                                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-all duration-200 ${isActiveRoute(sub.path)
                                  ? "bg-indigo-50 text-indigo-600 font-medium"
                                  : "text-slate-500 hover:bg-slate-100"
                                  }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ml-4 ${isActiveRoute(sub.path)
                                    ? "bg-indigo-600"
                                    : "bg-slate-400"
                                    }`}
                                >
                                  {" "}
                                  <FaCircle
                                    size={6}
                                    className={
                                      isActiveRoute(sub.path)
                                        ? "text-indigo-600"
                                        : "text-slate-400"
                                    }
                                  />
                                </span>
                                <span className="whitespace-nowrap font-medium ml-1 text-sm">
                                  {sub.label}
                                </span>
                              </Link>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
