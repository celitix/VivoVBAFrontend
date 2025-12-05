import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useRoleContext } from "@/context/currentRoleContext";

// MainLayout
import Mainlayout from "@/mainlayout/Mainlayout";

// Dashboard
import Dashboard from "@/dashboard/Dashboard";

// ManageUser
import ManageUser from "@/ManageUser/ManageUser";
import SurveyFormReport from "@/SurveyForm/SurveyFormReport";
import SurveyFormUser from "@/SurveyForm/SurveyFormUser";
import ManageModels from "@/ManageModels/ManageModels";
import VivoTypingLoader from "@/components/loaders/VivoTypingLoader";
// import SurveyForm from "@/SurveyForm/SurveyForm";

const Approutes = () => {
  const { currentRole, isLoading } = useRoleContext();

  if (isLoading) {
    return <VivoTypingLoader />;
  }
  console.log("currentRole from app routes", currentRole)
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        {/* <Route index element={<Dashboard />} /> */}

        {/*========================Manage User====================== */}

        {/* <Route path="/manageuser" element={<ManageUser />} /> */}

        {/* <Route index element={<ManageUser />} /> */}
        {currentRole === "admin" && (
          <Route index element={<ManageUser />} />
        )}

        {currentRole === "user" && (
          <Route index element={<SurveyFormUser />} />
        )}

        {/* {!currentRole && <Route index element={<Navigate to="/login" replace />} />} */}

        <Route path="/surveyformreport" element={<SurveyFormReport />} />
        <Route path="/managemodels" element={<ManageModels />} />
      </Route>
    </Routes>
  );
};

export default Approutes;
