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
  ReferenceLine,
  Area,
} from "recharts";

const Chart = ({ data, thresholdData }) => {
  // Combine the historical data and threshold data
  const combinedData = data.map((row, index) => ({
    ...row,
    threshold: thresholdData[index]?.threshold, // Add threshold from thresholdData if available
  }));

  // Dynamically get threshold values from thresholdData (fallback to default values if not available)
  const safetyStockThreshold =
    thresholdData.length > 0 ? thresholdData[0]?.safetyStockThreshold : 100; // Default value
  const replenishmentThreshold =
    thresholdData.length > 0 ? thresholdData[0]?.replenishmentThreshold : 150; // Default value
  const restockThreshold =
    thresholdData.length > 0 ? thresholdData[0]?.restockThreshold : 50; // Default value

  // Filter data for areas below each threshold
  const safetyStockData = combinedData.filter(
    (row) => row.inventory_level < safetyStockThreshold
  );
  const replenishmentData = combinedData.filter(
    (row) => row.inventory_level < replenishmentThreshold
  );
  const restockData = combinedData.filter(
    (row) => row.inventory_level < restockThreshold
  );

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

        {/* Safety Stock Threshold Line */}
        <ReferenceLine
          y={safetyStockThreshold}
          label="Safety Stock"
          stroke="red"
          strokeDasharray="3 3"
        />

        {/* Replenishment Threshold Line */}
        <ReferenceLine
          y={replenishmentThreshold}
          label="Replenishment"
          stroke="orange"
          strokeDasharray="3 3"
        />

        {/* Restock Threshold Line */}
        <ReferenceLine
          y={restockThreshold}
          label="Restock"
          stroke="green"
          strokeDasharray="3 3"
        />

        {/* Highlight areas where inventory is below Safety Stock Threshold */}
        <Area
          type="monotone"
          dataKey="inventory_level"
          fill="#ff6347"
          fillOpacity={1}
          stroke="none"
          isAnimationActive={true}
          data={safetyStockData} // Pass the filtered data for safety stock
        />

        {/* Highlight areas where inventory is below Replenishment Threshold */}
        <Area
          type="monotone"
          dataKey="inventory_level"
          fill="#ffa500"
          fillOpacity={1}
          stroke="none"
          isAnimationActive={true}
          data={replenishmentData} // Pass the filtered data for replenishment
        />

        {/* Highlight areas where inventory is below Restock Threshold */}
        <Area
          type="monotone"
          dataKey="inventory_level"
          fill="#32cd32"
          fillOpacity={1}
          stroke="none"
          isAnimationActive={true}
          data={restockData} // Pass the filtered data for restock
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
