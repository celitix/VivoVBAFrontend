// import React, { useState, useEffect } from "react";
// import { trackData } from "../apis/manageuser/manageuser";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// const COLORS = ["#FF8A65", "#4DB6AC", "#BA68C8", "#4FC3F7", "#FFD54F", "#9575CD"];

// const UserDashboard = () => {
//   const [trackingData, setTrackingData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const trackLeadData = async () => {
//     try {
//       const res = await trackData();
//       if (res?.status) {
//         setTrackingData(res.data[0]);
//       }
//       console.log("res", res);
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("trackingData", trackingData);

//   useEffect(() => {
//     trackLeadData();
//   }, []);

//   if (loading) return <p className="text-center mt-6">Loading...</p>;
//   if (!trackingData) return <p className="text-center mt-6">No Data Found</p>;

//   // 📊 Bar Chart data (Model Performance)
// const barData = {
//   labels: filteredModelStats.map((item) => item.model),
//   datasets: [
//     {
//       label: "Responses",
//       data: filteredModelStats.map((item) => item.responses),
//       backgroundColor: COLORS,
//       borderRadius: 12,
//     },
//   ],
// };

// const barOptions = {
//   responsive: true,
//   plugins: { legend: { display: false } },
//   animation: { duration: 800, easing: "easeOutQuart" },
//   scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
// };

//   return (
//     <div className="p-6 space-y-6">
//       {/* **************************************************** Header **************************************************** */}
//       <h1 className="text-2xl font-bold text-gray-800">
//         Welcome, {trackingData.user_name}
//       </h1>

//         {/* Summary Boxes */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         <StatCard label="Responses" value={trackingData.total_responses} />
//         <StatCard label="Leads" value={trackingData.total_leads} />
//         <StatCard label="Conversions" value={trackingData.total_conversions} />
//         <StatCard label="Leads / Response" value={trackingData.leads_per_response.toFixed(2)} />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         <ChartBox title="Model Performance">
//           <Bar data={barData} />
//         </ChartBox>

//         <ChartBox title="Source Distribution">
//           <Doughnut data={doughnutData} />
//         </ChartBox>
//       </div>

//     </div>
//   );
// };

// export default UserDashboard;

// // Reusable UI Components
// // const StatCard = ({ label, value }) => (
// //   <div className="bg-white shadow-lg p-6 rounded-xl text-center hover:scale-105 transition">
// //     <p className="text-gray-600 font-medium">{label}</p>
// //     <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
// //   </div>
// // );

// // const ChartBox = ({ title, children }) => (
// //   <div className="bg-white shadow-lg p-6 rounded-xl">
// //     <h2 className="text-lg font-semibold mb-4">{title}</h2>
// //     {children}
// //   </div>
// // );

// // const Table = ({ title, headers, rows }) => (
// //   <div className="bg-white shadow-lg p-6 rounded-xl overflow-x-auto">
// //     <h2 className="text-lg font-semibold mb-4">{title}</h2>
// //     <table className="w-full border text-left">
// //       <thead>
// //         <tr className="bg-gray-200 border-b">
// //           {headers.map((h, i) => (
// //             <th key={i} className="p-2">{h}</th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {rows.map((row, i) => (
// //           <tr key={i} className="border-b hover:bg-gray-100">
// //             {row.map((cell, j) => (
// //               <td key={j} className="p-2">{cell}</td>
// //             ))}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   </div>
// // );

// const StatCard = ({ label, value }) => (
//   <div className="bg-white shadow-lg p-6 rounded-xl text-center hover:scale-105 transition">
//     <p className="text-gray-600 font-medium">{label}</p>
//     <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//   </div>
// );

// const ChartBox = ({ title, children }) => (
//   <div className="bg-white shadow-lg p-6 rounded-xl">
//     <h2 className="text-lg font-semibold mb-4">{title}</h2>
//     {children}
//   </div>
// )

import React, { useEffect, useState, useMemo } from "react";
import { trackData } from "../apis/manageuser/manageuser";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await trackData();
        const serverData = res?.data?.data || res?.data || res;
        setTrackingData(serverData?.[0] || null);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
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

  console.log("barData:", barData);

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    animation: { duration: 700, easing: "easeOutQuart" },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  /**  Doughnut With % Tooltip */
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

return (
  <div className="px-3 sm:px-6 py-6 space-y-8 max-w-[1400px] mx-auto">
    
    {/* HEADER */}
    <div className="text-center sm:text-left">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
        👋 Welcome Back,
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">
          {safe.user_name}
        </span>
      </h1>
      <p className="text-gray-500 mt-1 text-xs sm:text-sm">
        Ready to explore your performance stats?
      </p>
    </div>

    {/* STAT CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      <Stat label="Responses" value={safe.total_responses} icon={ReplyAllIcon} />
      <Stat label="Leads" value={safe.total_leads} icon={PeopleAltIcon} />
      <Stat label="Conversions" value={safe.total_conversions} icon={CheckCircleIcon} />
      <Stat label="Lead/Response" value={safe.leads_per_response.toFixed(2)} icon={TrendingUpIcon} />
    </div>

    {/* FILTER SECTION */}
    {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelectedModel(opt.key)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              selectedModel === opt.key
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div> */}

    {/* CHARTS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartBox title="Model Performance">
        <div className="h-[280px] sm:h-[340px]">
          <Bar key={selectedModel} data={barData} options={barOptions} />
        </div>
      </ChartBox>

      <ChartBox title="Response Source Breakdown">
        <div className="flex justify-center">
          <div className="w-[200px] sm:w-[260px] md:w-[300px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </ChartBox>
    </div>

    {/* TABLE */}
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
                  onClick={() => setSelectedRow(row)}
                  className="border-b border-indigo-100 hover:bg-indigo-50 cursor-pointer"
                >
                  <td className="p-3 text-gray-800">{row.model}</td>
                  <td className="p-3 font-semibold text-indigo-600">{row.responses}</td>
                  <td className="p-3 font-semibold text-indigo-600">{row.leads}</td>
                  <td className="p-3 font-semibold text-indigo-600">{row.conversions}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ChartBox>

    {selectedRow && (
      <ModelModal row={selectedRow} onClose={() => setSelectedRow(null)} />
    )}

  </div>
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

const ModelModal = ({ row, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50  shadow-lg p-6 rounded-xl text-center hover:scale-105 transitio">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold mb-2 text-gray-900">{row.model}</h3>
      <p>Responses: {row.responses}</p>
      <p>Leads: {row.leads}</p>
      <p>Conversions: {row.conversions}</p>

      <button
        onClick={onClose}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md w-full"
      >
        Close
      </button>
    </div>
  </div>
);

export default UserDashboard;
