import React, { useState, useEffect } from "react";
import { Chip, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function ModelResponse({ data }) {
  const [modelData, setModelData] = useState([]);
  const [selectedModel, setSelectedModel] = useState("All");

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

  // Filtered data for chart
  const chartData = {
    labels: ["Responses", "Leads", "Conversions"],
    datasets: [
      {
        label: selectedModel === "All" ? "All Models" : selectedModel,
        data:
          selectedModel === "All"
            ? [
                modelData.reduce((a, b) => a + b.total_responses, 0),
                modelData.reduce((a, b) => a + b.total_leads, 0),
                modelData.reduce((a, b) => a + b.total_conversions, 0),
              ]
            : modelData
                .filter((m) => m.model === selectedModel)
                .map((m) => [
                  m.total_responses,
                  m.total_leads,
                  m.total_conversions,
                ])[0],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg my-8">
      {/* Section Title */}
      <Typography variant="h6" className="my-4">
        Model Responses
      </Typography>

      {/* Chips */}
      <div
        className="
    sm:overflow-x-visible sm:whitespace-normal
    overflow-x-auto whitespace-nowrap
    py-2
  "
      >
        <div className="flex gap-3 flex-wrap sm:flex-wrap w-max sm:w-auto">
          <Chip
            label="All"
            color={selectedModel === "All" ? "primary" : "default"}
            onClick={() => setSelectedModel("All")}
          />

          {modelData.map((m, idx) => (
            <Chip
              key={idx}
              label={m.model}
              color={selectedModel === m.model ? "primary" : "default"}
              onClick={() => setSelectedModel(m.model)}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        key={selectedModel} // animate chart on model change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          }}
          height={250}
        />
      </motion.div>
    </div>
  );
}
