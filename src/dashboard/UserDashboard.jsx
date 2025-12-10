import React, { useEffect, useState, useMemo } from "react";
import { trackData } from "../apis/manageuser/manageuser";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import toast from "react-hot-toast";
import UniversalButton from "@/components/common/UniversalButton";
import {
  RefreshCw,
  Zap,
  CheckCircle2,
  BarChart2,
  TrendingUp,
} from "lucide-react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

const COLORS = [
  "#FF8A65",
  "#4DB6AC",
  "#BA68C8",
  "#4FC3F7",
  "#FFD54F",
  "#9575CD",
];

const UserDashboard = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await trackData();
      if (res.status === true) {
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        const serverData = res?.data?.data || res?.data || res;
        setTrackingData(serverData?.[0] || null);
        toast.success("Latest Metrics Loaded Successfully!");
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // SAFETY fallback
  const safe = trackingData || {
    responses_per_model: [],
    leads_per_model: [],
    conversions_per_model: [],
    responsesPerSource: [],
    total_responses: 0,
    total_leads: 0,
    total_conversions: 0,
    leads_per_response: 0,
    user_name: "Loading...",
  };

  const modelStats = useMemo(() => {
    const fullList = safe.responses || [];

    return fullList.map((item) => {
      return {
        model: item.model || "Unknown",
        responses: item.total_responses || 0,
        leads: item.total_leads || 0,
        conversions: item.total_conversions || 0,
      };
    });
  }, [safe]);

  const filterOptions = [
    { key: "All", label: "All" },
    ...modelStats.map((m) => ({
      key: m.model,
      label: m.model,
    })),
  ];

  const filteredStats =
    selectedModel === "All"
      ? modelStats
      : modelStats.filter((m) => m.model === selectedModel);

  const barData = {
    labels: filteredStats.map((i) => i.model),
    datasets: [
      {
        label: "Responses",
        data: filteredStats.map((i) => i.responses),

        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = c.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(129, 140, 248, 0.7)");
          gradient.addColorStop(1, "rgba(79, 70, 229, 1)");
          return gradient;
        },

        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 12,
        hoverBackgroundColor: "rgba(79, 70, 229, 1)",
      },
    ],
  };


  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // ⭐ Most important fix!
    plugins: {
      legend: { display: false },
    },
    layout: {
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 40,
          minRotation: 0,
          autoSkip: true,
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 10 } },
      },
    },
  };

  const doughnutTotal = safe.responsesPerSource.reduce(
    (sum, i) => sum + (i.total_responses || 0),
    0
  );

  const DOUGHNUT_COLORS = [
    "rgba(129, 140, 248, 1)",
    "rgba(99, 102, 241, 1)",
    "rgba(79, 70, 229, 1)",
    "rgba(165, 180, 252, 1)",
    "rgba(196, 181, 253, 1)",
    "rgba(167, 139, 250, 1)",
    "rgba(102, 126, 234, 1)",
    "rgba(139, 92, 246, 1)",
  ];

  const doughnutData = {
    labels: safe.responsesPerSource.map((i) => i.source),
    datasets: [
      {
        data: safe.responsesPerSource.map((i) => i.total_responses),
        backgroundColor: DOUGHNUT_COLORS,
        hoverOffset: 8,
        borderWidth: 2,
        borderColor: "#FFF",
      },
    ],
  };

  const doughnutOptions = {
    cutout: "55%",
    radius: "80%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed;
            const pct = doughnutTotal
              ? ((v / doughnutTotal) * 100).toFixed(1)
              : 0;
            return `${ctx.label}: ${v} (${pct}%)`;
          },
        },
      },
    },
  };

  const DynamicLoadingHeader = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
      {
        icon: TrendingUp,
        text: "Analyzing latest user trends...",
        color: "text-blue-600",
      },
      {
        icon: BarChart2,
        text: "Calculating model wise responses...",
        color: "text-indigo-600",
      },
      {
        icon: Zap,
        text: "Fetching real-time quick insights...",
        color: "text-teal-600",
      },
      {
        icon: CheckCircle2,
        text: "Validating data integrity...",
        color: "text-green-600",
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 1500); // Change every 1.5 seconds

      return () => clearInterval(interval);
    }, []);

    const StepIcon = steps[currentStep].icon;

    return (
      <div className="flex items-center justify-start gap-4 mb-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`p-3 rounded-full bg-white shadow-xl ${steps[currentStep].color}`}
        >
          <StepIcon size={24} className="animate-pulse" />
        </motion.div>

        <motion.div
          key={steps[currentStep].text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Dashboard
          </h2>
          <p className={`text-sm font-medium ${steps[currentStep].color}`}>
            {steps[currentStep].text}
          </p>
        </motion.div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="p-10 rounded-2xl bg-white shadow-2xl border border-gray-100"
            >
              <DynamicLoadingHeader />
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="p-6 space-y-8">
          {/* ***************************** HEADER ************************************* */}
          <div className="mb-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center justify-between md:gap-4">
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
                onClick={() => fetchData()}
              />
            </div>
            {/* LEFT SIDE - Welcome Text */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                👋 Welcome Back,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">
                  {safe.user_name}
                </span>
              </h1>

              <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                Ready to explore your performance stats?
              </p>
            </div>

            {/* RIGHT SIDE - Logo */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/vivologonew.png"
                alt="vivo Logo"
                className="h-10 sm:h-12 md:h-14 object-contain opacity-90 mb-3"
              />
              <p className="text-sm md:text-base font-semibold text-gray-800">
                Yingjia Communication Pvt. Ltd.
              </p>
            </div>
          </div>

          {/* ************************************************************** * STAT CARDS *********************************************** */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Stat
              label="Responses"
              value={safe.total_responses}
              icon={ReplyAllIcon}
            />
            <Stat label="Leads" value={safe.total_leads} icon={PeopleAltIcon} />
            <Stat
              label="Conversions"
              value={safe.total_conversions}
              icon={CheckCircleIcon}
            />
            <Stat
              label="Lead/Response"
              value={safe.leads_per_response.toFixed(2)}
              icon={TrendingUpIcon}
            />
          </div>

          {/*  Model Filters + Bar Chart Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-4 sm:p-6 space-y-4">
            {/* FILTER CHIPS */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide  py-2 px-1 sm:flex-wrap sm:justify-start  lg:overflow-visible lg:flex-wrap">
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedModel(opt.key)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition
        ${
          selectedModel === opt.key
            ? "bg-indigo-600 text-white shadow-md scale-105"
            : "bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
        }
      `}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* BAR CHART */}
            <div className="w-full min-h-[260px] sm:min-h-[330px] md:min-h-[380px] lg:min-h-[420px]">
              <Bar key={selectedModel} data={barData} options={barOptions} />
            </div>
          </div>

          <ChartBox title="Response Source Breakdown">
            <div className="flex justify-center items-center w-full">
              <div className=" h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]  max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] w-full mx-auto">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </ChartBox>

          {/* DETAIL TABLE */}
          <ChartBox title="Model Details">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm text-left border-collapse">
                <thead className="bg-indigo-100 text-indigo-700 border-b border-indigo-300">
                  <tr>
                    <th className="p-3 font-semibold">Model</th>
                    <th className="p-3 font-semibold">Responses</th>
                    <th className="p-3 font-semibold">Leads</th>
                    <th className="p-3 font-semibold">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.length ? (
                    filteredStats.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-indigo-100 hover:bg-indigo-50 cursor-pointer"
                      >
                        <td className="p-3 text-gray-800">{row.model}</td>
                        <td className="p-3 font-semibold text-indigo-600">
                          {row.responses}
                        </td>
                        <td className="p-3 font-semibold text-indigo-600">
                          {row.leads}
                        </td>
                        <td className="p-3 font-semibold text-indigo-600">
                          {row.conversions}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 p-4">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartBox>
        </div>
      )}
    </>
  );
};

/* ⬇ Small Component Definitions */

const Stat = ({ label, value, icon: Icon }) => (
  <div
    className="
    bg-white p-5 rounded-xl shadow-lg relative overflow-hidden
    hover:shadow-2xl hover:-translate-y-1
    transition-all duration-300 cursor-pointer
  "
  >
    {/* Indigo Ribbon */}
    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400"></div>

    {/* Icon */}
    {Icon && (
      <div className="text-indigo-500 text-3xl mb-1 pl-3">
        <Icon />
      </div>
    )}

    <p className="text-gray-600 text-sm font-medium pl-3">{label}</p>

    <p className="text-3xl font-extrabold text-gray-900 mt-1 pl-3 tracking-tight">
      {value}
    </p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white shadow-lg p-6 rounded-2xl border border-indigo-100 hover:shadow-xl transition">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default UserDashboard;
