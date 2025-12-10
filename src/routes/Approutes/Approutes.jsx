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
import AdminDashboard from "@/dashboard/AdminDashboard";
import UserDashboard from "@/dashboard/UserDashboard";

// ManageUser
import ManageUser from "@/ManageUser/ManageUser";

// SurveyForm Reports
import SurveyFormReport from "@/SurveyForm/SurveyFormReport";
import SurveyFormUser from "@/SurveyForm/SurveyFormUser";
import SurveyFormReportAll from "@/SurveyForm/SurveyFormReportAll";

import ManageModels from "@/ManageModels/ManageModels";

import VivoTypingLoader from "@/components/loaders/VivoTypingLoader";

import Loader from "@/components/loaders/Loader";

const Approutes = () => {
  const { currentRole, isLoading } = useRoleContext();

  if (isLoading) {
    // return <VivoTypingLoader />;
    return <Loader />;
  }
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>

        {currentRole === "admin" && (
          <Route index element={<AdminDashboard />} />
        )}

        {currentRole === "user" && (
          <Route index element={<UserDashboard />} />
        )}

        {/* {!currentRole && <Route index element={<Navigate to="/login" replace />} />} */}

        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/surveyformreport" element={<SurveyFormReport />} />
        <Route path="/surveyformreportall" element={<SurveyFormReportAll />} />
        <Route path="/managemodels" element={<ManageModels />} />
        <Route path="/surveyformuser" element={<SurveyFormUser />} />
      </Route>
    </Routes>
  );
};

export default Approutes;
