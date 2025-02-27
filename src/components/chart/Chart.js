// Chart.js (example using Recharts)
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Chart = ({ data, thresholdData }) => {
  // Combine the two arrays based on index or a matching key
  // (assuming both arrays have the same length and same date order)
  const combinedData = data.map((row, index) => ({
    ...row,
    threshold: thresholdData[index]?.threshold, // pull in the threshold
  }));

  return (
    <LineChart width={600} height={300} data={combinedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />

      {/* Inventory Level Line */}
      <Line
        type="monotone"
        dataKey="inventory_level"
        stroke="#8884d8"
        name="Inventory Level"
      />

      {/* Threshold Line */}
      <Line
        type="monotone"
        dataKey="threshold"
        stroke="#82ca9d"
        name="Threshold Level"
      />
    </LineChart>
  );
};

export default Chart;
