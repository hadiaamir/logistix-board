import React from "react";
import {
  ResponsiveContainer,
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
  const combinedData = data.map((row, index) => ({
    ...row,
    threshold: thresholdData[index]?.threshold, // pull in the threshold
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* Inventory Level Line */}
        <Line
          type="monotone"
          dataKey="inventory_level"
          stroke="#FF6347"
          strokeWidth={3}
          dot={false}
          name="Inventory Level"
        />

        {/* Threshold Line */}
        <Line
          type="monotone"
          dataKey="threshold"
          stroke="#32CD32"
          strokeWidth={3}
          dot={false}
          name="Threshold Level"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
