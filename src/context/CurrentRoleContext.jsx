// // context/CurrentRoleContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";

// const RoleContext = createContext();

// export function RoleProvider({ children }) {
//   const [currentRole, setCurrentRole] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedRole = sessionStorage.getItem("userRole");

//     if (savedRole) {
//       setCurrentRole(savedRole);
//     }
//     setIsLoading(false);
//   }, []);

//   // useEffect(() => {
//   //   const savedRole = sessionStorage.getItem("userRole");
//   //   if (savedRole) {
//   //     setCurrentRole(savedRole);
//   //   }

//   //   const minimumLoaderTime = 3000;

//   //   const timer = setTimeout(() => {
//   //     setIsLoading(false);
//   //   }, minimumLoaderTime);

//   //   // Cleanup timer if component unmounts early
//   //   return () => clearTimeout(timer);
//   // }, []);

//   const value = {
//     currentRole,
//     setCurrentRole,
//     isLoading,
//   };

//   return (
//     <RoleContext.Provider value={value}>
//       {children}
//     </RoleContext.Provider>
//   );
// }

// export const useRoleContext = () => useContext(RoleContext);

// context/CurrentRoleContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to read role from sessionStorage
  const loadRole = () => {
    const savedRole = sessionStorage.getItem("userRole");
    setCurrentRole(savedRole || "");
  };

  // Initial load
  useEffect(() => {
    loadRole();
    setIsLoading(false);
  }, []);

  // Listen for changes in sessionStorage (triggered from other tabs OR same tab after login)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userRole") {
        loadRole();
      }
    };

    // Also handle direct session like setItem (in case storage event doesn't fire in same tab)
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (key === "userRole") {
        loadRole();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      // Restore original if needed (optional)
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  const value = {
    currentRole,
    setCurrentRole: (role) => {
      sessionStorage.setItem("userRole", role);
      setCurrentRole(role);
    },
    isLoading,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRoleContext = () => useContext(RoleContext);