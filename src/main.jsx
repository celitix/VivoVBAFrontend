import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import App from "./App.jsx";
import { RoleProvider } from "@/context/CurrentRoleContext";
import "./utils/chartjs-setup.js"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RoleProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </RoleProvider>
  </StrictMode>
);
