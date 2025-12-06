import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { trackData } from "../apis/manageuser/manageuser";
import { FaUserCheck } from "react-icons/fa";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUsers, FaChartLine } from "react-icons/fa";

import { Grid, Card, CardContent, Typography } from "@mui/material";
import Reports from "./AdminDashboardComponents/Reports";

// Register Chart.js components
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [selectTab, setSelectTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log("data", data);

  const tabs = [
    { id: 0, label: "Overview" },
    { id: 1, label: "Reports" },
  ];

  const mainTabs = [
    { id: 0, label: "Users" },
    { id: 1, label: "Responses" },
    { id: 2, label: "Leads" },
    { id: 3, label: "Conversations" },
  ];

  const trackLeadData = async () => {
    setLoading(true);
    try {
      const res = await trackData();
      if (res.status === true) {
        setData(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    trackLeadData();
  }, []);

  const dashboardData = {
    users: [
      {
        id: 10,
        name: "Arihasnt",
        summary: {
          total_responses: 1,
          total_leads: 0,
          total_conversions: 0,
          leads_per_response: 0,
        },
        charts: {
          modelResponses: [{ model: "V60", total_responses: 1 }],
          modelLeads: [{ model: "V60", total_leads: 0 }],
          modelConversions: [{ model: "V60", total_conversions: 0 }],
          sourceResponses: [{ source: "s", total_responses: 1 }],
        },
      },
    ],
  };

  const user = dashboardData.users[0];
  const modelResponseData = {
    labels: user.charts.modelResponses.map((m) => m.model),
    datasets: [
      {
        label: "Responses",
        data: user.charts.modelResponses.map((m) => m.total_responses),
        backgroundColor: ["#4F46E5"],
      },
    ],
  };

  const modelLeadsData = {
    labels: user.charts.modelLeads.map((m) => m.model),
    datasets: [
      {
        data: user.charts.modelLeads.map((m) => m.total_leads),
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
      },
    ],
  };

  const sourceResponseData = {
    labels: user.charts.sourceResponses.map((s) => s.source),
    datasets: [
      {
        data: user.charts.sourceResponses.map((s) => s.total_responses),
        backgroundColor: ["#6366F1", "#F43F5E", "#14B8A6"],
      },
    ],
  };

  const StatCard = ({ title, value, color }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 
      hover:shadow-lg transition-all cursor-pointer flex flex-col gap-1"
      >
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      </motion.div>
    );
  };

  const userCount = data?.length || 0;
  const growthRate = 12.6;

  // Pie Chart Data
  const pieData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [userCount - 10, 10], // Example values
        backgroundColor: ["#3B82F6", "#F87171"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full p-6">
      {/* ***********Header************* */}

      <div className="w-full flex justify-center mt-6">
        <div className="flex gap-10 relative pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative text-lg font-medium transition-all duration-300 
              ${
                tab === t.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
            >
              {t.label}

              {/* UNDERLINE ANIMATION */}
              {tab === t.id && (
                <motion.div
                  //   layoutId="underline"
                  className="absolute left-0 right-0 h-[3px] bg-blue-600 mx-3 rounded-full"
                  style={{ bottom: "-6px" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* *******************Hero Section******************** */}
      {tab === 0 && (
        <div className="grid grid-cols-4 gap-6 mt-8">
          {/* ---------------- LEFT MAIN PANEL ---------------- */}
          <div className="col-span-3 bg-gray-50 p-6 rounded-xl shadow-sm">
            {/* Dashboard Header */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Admin Dashboard
            </h2>

            {/* Tabs */}
            <div className="flex gap-10 relative pb-2 border-b border-gray-200">
              {mainTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectTab(t.id)}
                  className={`relative text-lg font-medium transition-all duration-300 
          ${
            selectTab === t.id
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
                >
                  {t.label}
                  {/* Animated Underline */}
                  {selectTab === t.id && (
                    <motion.div
                      className="absolute left-0 right-0 h-[3px] bg-blue-600 mx-3 rounded-full"
                      style={{ bottom: "-6px" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)",
                }}
              >
                {/* Background Icon */}
                <FaUsers
                  size={80}
                  className="absolute opacity-10 right-4 top-4 transform rotate-12"
                />

                {/* Top Bar Accent */}
                <div className="absolute top-0 left-0 w-16 h-2 bg-white/50 rounded-tr-lg"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-medium text-white/90 uppercase">
                      Total Users
                    </h2>
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaUsers size={20} />
                    </div>
                  </div>

                  <p className="text-4xl font-bold">{userCount}</p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mt-2 text-sm text-white/80"
                  >
                    <div className="text-green-300 font-semibold">+12%</div>
                    <span>Since last week</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)", // Green gradient
                }}
              >
                {/* Background Icon */}
                <FaUserCheck
                  size={80}
                  className="absolute opacity-10 right-4 top-4 transform rotate-12"
                />

                {/* Top Bar Accent */}
                <div className="absolute top-0 left-0 w-16 h-2 bg-white/30 rounded-tr-lg"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-medium text-white/90 uppercase">
                      Active Today
                    </h2>
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaUserCheck size={20} />
                    </div>
                  </div>

                  <p className="text-4xl font-bold">
                    {Math.floor(userCount * 0.2)}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mt-2 text-sm text-white/80"
                  >
                    <div className="text-white/90 font-semibold">+5%</div>
                    <span>Active growth since yesterday</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100 flex flex-col items-center"
              >
                <h3 className="text-gray-700 font-semibold mb-4">
                  Model Wise Responses
                </h3>
                <div className="w-full h-64">
                  <Bar
                    data={modelResponseData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100 flex flex-col items-center"
              >
                <h3 className="text-gray-700 font-semibold mb-4">
                  Responses By Source
                </h3>
                <div className="w-full h-64">
                  <Doughnut
                    data={sourceResponseData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* ---------------- RIGHT PANEL ---------------- */}
          <div className="col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Quick Insights
            </h2>

            {/* Example: Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white p-4 shadow-md border border-gray-100"
            >
              <h3 className="text-gray-600 text-sm font-medium">
                New Users Today
              </h3>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {Math.floor(userCount * 0.1)}
              </p>
            </motion.div>

            {/* Example: Top Performing Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white p-4 shadow-md border border-gray-100"
            >
              <h3 className="text-gray-600 text-sm font-medium">Top Model</h3>
              <p className="text-xl font-semibold mt-1 text-green-600">V60</p>
            </motion.div>

            {/* Example: Recent Leads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white p-4 shadow-md border border-gray-100"
            >
              <h3 className="text-gray-600 text-sm font-medium">
                Recent Leads
              </h3>
              <p className="text-xl font-semibold mt-1 text-purple-600">5</p>
            </motion.div>

            {/* Optional: Mini Pie or Doughnut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white p-4 shadow-md border border-gray-100 flex flex-col items-center"
            >
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                User Segments
              </h3>
              <div className="w-full h-32">
                <Doughnut
                  data={sourceResponseData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {tab === 1 && <Reports />}
    </div>
  );
};

export default AdminDashboard;

// Add this logo at top left or right <img src="/vivologonew.png" alt="vivo" className="h-14 mx-auto mb-4" />
