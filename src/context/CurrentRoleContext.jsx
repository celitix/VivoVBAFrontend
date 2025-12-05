// context/CurrentRoleContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRole = sessionStorage.getItem("userRole");

    if (savedRole) {
      setCurrentRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   const savedRole = sessionStorage.getItem("userRole");
  //   if (savedRole) {
  //     setCurrentRole(savedRole);
  //   }

  //   const minimumLoaderTime = 3000;

  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, minimumLoaderTime);

  //   // Cleanup timer if component unmounts early
  //   return () => clearTimeout(timer);
  // }, []);

  const value = {
    currentRole,
    setCurrentRole,
    isLoading,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRoleContext = () => useContext(RoleContext);