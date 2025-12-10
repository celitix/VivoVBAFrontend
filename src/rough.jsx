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
import ModelResponse from "./AdminDashboardComponents/ModelResponse";
import { FaRegEnvelope } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { RefreshCw } from "lucide-react";
import UniversalButton from "@/components/common/UniversalButton";
import toast from "react-hot-toast";

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
  const [selectTab, setSelectTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [metaData, setMetaData] = useState(null);

  const mainTabs = [
    { id: 0, label: "Users" },
    { id: 1, label: "Responses" },
    { id: 2, label: "Leads" },
    { id: 3, label: "Source" },
  ];

  const trackLeadData = async () => {
    setLoading(true);
    try {
      const res = await trackData();
      if (res.status === true) {
        setData(res.data);
        setMetaData(res.meta);
        toast.success("Latest Metrics Loaded Successfully!")
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackLeadData();
  }, []);

  // ****************data seggregation ****************

  useEffect(() => {
    if (data) {
      // Flatten all responses
      const allResponses = data.flatMap((d) =>
        d.responses.map((response) => ({
          user_id: d.user_id,
          user_name: d.user_name,
          model: response.model,
          total_responses: Number(response.total_responses || 0),
          total_leads: Number(response.total_leads || 0),
          total_conversions: Number(response.total_conversions || 0),
        }))
      );

      // Aggregate counts by model
      const aggregated = {};

      allResponses.forEach((res) => {
        if (!res.model) return; // skip empty model names

        if (!aggregated[res.model]) {
          aggregated[res.model] = { ...res }; // create a new object
        } else {
          // sum up the counts
          aggregated[res.model].total_responses += res.total_responses;
          aggregated[res.model].total_leads += res.total_leads;
          aggregated[res.model].total_conversions += res.total_conversions;
        }
      });

      const uniqueModelResponses = Object.values(aggregated);

      setModelData(uniqueModelResponses);
    }
  }, [data]);

  // leads data
  const leadsData = data.map((d) => d.leads_per_model);
  const totalLeads = leadsData
    .flat()
    .reduce((acc, curr) => acc + (curr.total_leads || 0), 0);

  //source data
  const source = data.map((d) => d.responsesPerSource);

  const flattened = source.flatMap((arr) => arr); // removes inner array layers

  // Now filter counts
  const instagramCount = flattened
    .filter((item) => item?.source?.toLowerCase() === "instagram")
    .reduce((sum, item) => sum + item.total_responses, 0);

  const facebookCount = flattened
    .filter((item) => item?.source?.toLowerCase() === "facebook")
    .reduce((sum, item) => sum + item.total_responses, 0);

  const youtubeCount = flattened
    .filter((item) => item?.source?.toLowerCase() === "youtube")
    .reduce((sum, item) => sum + item.total_responses, 0);

  const sourceResponseData = {
    labels: ["Facebook", "YouTube", "Instagram"],
    datasets: [
      {
        label: "Lead Sources",
        data: [facebookCount, youtubeCount, instagramCount],
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)", // blue (facebook)
          "rgba(239, 68, 68, 0.6)", // red (youtube)
          "rgba(168, 85, 247, 0.6)", // purple (instagram)
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const modelResponseData = {
    labels: modelData.map((item) => item.model), // X-axis → model names
    datasets: [
      {
        label: "Total Responses",
        data: modelData.map((item) => item.total_responses), // Y-axis → response count
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ---------------- LEFT MAIN PANEL ---------------- */}
        <div className="col-span-4 md:col-span-3 bg-gray-50 p-6 rounded-xl shadow-sm">
          {/* Dashboard Header */}
          <div className="flex items-center md:justify-between mb-8 flex-wrap justify-center">
            <img src="/vivologonew.png" alt="vivo" className="h-12" />
            <h2 className="text-2xl font-semibold text-gray-700">
              Yingjia Communication Pvt. Ltd.
            </h2>
          </div>
          {/* Tabs */}
          <div className="overflow-x-auto whitespace-nowrap scrollbar-thin flex justify-between">
            <div className="flex gap-4 relative pb-2 w-max">
              {mainTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectTab(t.id)}
                  className={`relative px-4 py-1 text-lg font-medium transition-all duration-300 rounded-full z-10
                  ${
                    selectTab === t.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}

                  {/* Animated capsule */}
                  {selectTab === t.id && (
                    <motion.div
                      layoutId="tab-capsule"
                      className="absolute inset-0 rounded-full z-[-1]"
                      style={{
                        background:
                          "linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)", // gradient color
                      }}
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
            <div className="flex items-center">
              <UniversalButton
                variant="secondary"
                label={loading ? "Refreshing..." : "Refresh"}
                disabled={loading}
                icon={
                  <RefreshCw
                    className={loading ? "animate-spin scale-x-[-1]" : ""}
                    size="18px"
                  />
                }
                onClick={() => trackLeadData()}
              />
            </div>
          </div>

          {/* Stats Cards */}
          {selectTab === 0 && (
            <div className="mt-6 grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white col-span-2 md:col-span-1"
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

                  <p className="text-4xl font-bold">{data.length}</p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mt-2 text-sm text-white/80"
                  >
                    <div className="text-green-300 font-semibold">
                      {metaData?.new_users_percentage} %
                    </div>
                    <span>Since last week</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-xl text-white col-span-2 md:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf)",
                }}
              >
                {/* Background silhouette icon */}
                <FaMobileAlt
                  size={120}
                  className="absolute opacity-10 right-2 top-2 rotate-12"
                />

                {/* Top badge */}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  Most Engaged Model
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full mt-4">
                  <h2 className="text-sm font-medium uppercase text-white/90 mb-1 tracking-wide">
                    Top Model
                  </h2>

                  {/* Model Name */}
                  <p className="text-3xl font-bold leading-tight drop-shadow-sm">
                    {metaData?.topModel || "N/A"}
                  </p>

                  {/* Sub info */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mt-4 text-sm text-white/90"
                  >
                    <span className="font-semibold text-white">
                      {metaData?.topModel}
                    </span>
                    <span className="opacity-80">
                      is trending highest today
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {selectTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white mt-6"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)",
              }}
            >
              {/* Background Icon */}
              <FaRegEnvelope
                size={80}
                className="absolute opacity-10 right-4 top-4 transform rotate-12"
              />

              {/* Top Bar Accent */}
              <div className="absolute top-0 left-0 w-16 h-2 bg-white/50 rounded-tr-lg"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-medium text-white/90 uppercase">
                    Total Responses
                  </h2>
                  <div className="p-2 bg-white/20 rounded-full">
                    <FaRegEnvelope size={20} />{" "}
                    {/* Envelope icon for responses */}
                  </div>
                </div>

                <p className="text-4xl font-bold">{modelData?.length}</p>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mt-2 text-sm text-white/80"
                ></motion.div>
              </div>
            </motion.div>
          )}
          {selectTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white mt-6"
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

              {/* Top Accent */}
              <div className="absolute top-0 left-0 w-16 h-2 bg-white/50 rounded-tr-lg"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-medium text-white/90 uppercase">
                    Total Leads
                  </h2>
                  <div className="p-2 bg-white/20 rounded-full">
                    <FaUsers size={20} />
                  </div>
                </div>

                <p className="text-4xl font-bold">{totalLeads}</p>
              </div>
            </motion.div>
          )}
          {selectTab === 3 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Instagram Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white col-span-3 md:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, #e879f9, #d946ef, #c084fc)", // softer insta gradient
                }}
              >
                <FaInstagram
                  size={80}
                  className="absolute opacity-10 right-4 top-4 rotate-12"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium uppercase text-white/90">
                      Instagram
                    </h2>
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaInstagram size={20} />
                    </div>
                  </div>

                  <p className="text-4xl font-bold mt-2">{instagramCount}</p>
                </div>
              </motion.div>

              {/* Facebook Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white col-span-3 md:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a8a, #3b82f6, #93c5fd)",
                }}
              >
                <FaFacebook
                  size={80}
                  className="absolute opacity-10 right-4 top-4 rotate-12"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium uppercase text-white/90">
                      Facebook
                    </h2>
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaFacebook size={20} />
                    </div>
                  </div>

                  <p className="text-4xl font-bold mt-2">{facebookCount}</p>
                </div>
              </motion.div>

              {/* YouTube Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl p-6 overflow-hidden shadow-lg text-white col-span-3 md:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, #7f1d1d, #dc2626, #fca5a5)", // deep red → soft salmon
                }}
              >
                <FaYoutube
                  size={80}
                  className="absolute opacity-10 right-4 top-4 rotate-12"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium uppercase text-white/90">
                      YouTube
                    </h2>
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaYoutube size={20} />
                    </div>
                  </div>

                  <p className="text-4xl font-bold mt-2">{youtubeCount}</p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Charts */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100 flex flex-col items-center col-span-2 md:col-span-1"
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
              className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100 flex flex-col items-center col-span-2 md:col-span-1"
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

          <ModelResponse data={data} />
        </div>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <div className="col-span-4 md:col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col gap-6">
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
              {metaData?.newUserToday}
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
            <p className="text-xl font-semibold mt-1 text-green-600">
              {metaData?.topModel}
            </p>
          </motion.div>

          {/* Example: Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-4 shadow-md border border-gray-100"
          >
            <h3 className="text-gray-600 text-sm font-medium">Recent Leads</h3>
            <p className="text-xl font-semibold mt-1 text-purple-600">
              {metaData?.recentLeadsCount}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-4 shadow-md border border-gray-100"
          >
            <h3 className="text-gray-600 text-sm font-medium">Total Models</h3>
            <p className="text-xl font-semibold mt-1 text-purple-600">
              {modelData?.length}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;