import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography
} from "@mui/material";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// ------------------------------
// DUMMY DATA
// ------------------------------
const dummyData = [
  { user_name: "Harish", total_responses: 0, total_leads: 0, total_conversions: 0 },
  { user_name: "Arihant", total_responses: 1, total_leads: 0, total_conversions: 0 },
  { user_name: "Akhil", total_responses: 17, total_leads: 14, total_conversions: 3 },
  { user_name: "Test", total_responses: 4, total_leads: 2, total_conversions: 2 }
];

// ------------------------------
// CHART DATA
// ------------------------------
const users = dummyData.map(u => u.user_name);
const responses = dummyData.map(u => u.total_responses);
const leads = dummyData.map(u => u.total_leads);
const conversions = dummyData.map(u => u.total_conversions);

// Bar chart config
const barData = {
  labels: users,
  datasets: [
    {
      label: "Responses",
      data: responses,
      backgroundColor: "#1976d2"
    }
  ]
};

// Pie chart config
const pieData = {
  labels: users,
  datasets: [
    {
      label: "Leads",
      data: leads,
      backgroundColor: ["#1976d2", "#9c27b0", "#ff9800", "#4caf50"]
    }
  ]
};

// Line chart config
const lineData = {
  labels: users,
  datasets: [
    {
      label: "Conversions",
      data: conversions,
      borderColor: "#ff4081",
      backgroundColor: "rgba(255, 64, 129, 0.3)",
      tension: 0.4
    }
  ]
};

// ------------------------------
// DASHBOARD UI
// ------------------------------
const Reports = () => {
  return (
    <Box p={4} sx={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        📊 Team Dashboard
      </Typography>

      {/* Top Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" fontWeight={700}>{dummyData.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Responses</Typography>
              <Typography variant="h4" fontWeight={700}>
                {responses.reduce((a, b) => a + b, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Leads</Typography>
              <Typography variant="h4" fontWeight={700}>
                {leads.reduce((a, b) => a + b, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" mb={2}>Responses by User</Typography>
            <Bar data={barData} />
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" mb={2}>Leads Distribution</Typography>
            <Pie data={pieData} />
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" mb={2}>Conversions Trend</Typography>
            <Line data={lineData} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
