"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import http from "@/utils/http.js";
import ThresholdForm from "../threshold_form/ThresholdForm";
import Chart from "../chart/Chart";
import SalesStats from "../inventory_stats/InventoryStats"; // Import the new component
import "./InventoryDashboard.scss";
import InventoryStats from "../inventory_stats/InventoryStats";

const InventoryDashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [thresholdData, setThresholdData] = useState([]);
  const [avgDailySales, setAvgDailySales] = useState(0);

  // Handle CSV Upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const csvFile = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const formData = new FormData();
        formData.append("file", csvFile);

        try {
          setUploading(true);
          setError(null);

          const response = await http.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("Upload success:", response.data);
          setCsvData(response.data);

          // Calculate average daily sales
          const totalSales = response.data.reduce(
            (sum, row) => sum + row.orders,
            0
          );
          setAvgDailySales(
            response.data.length ? totalSales / response.data.length : 0
          );
          setThresholdData([]); // Reset threshold data
        } catch (err) {
          console.error("Upload failed:", err);
          setError("Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      };

      reader.readAsText(csvFile);
    },
  });

  const handleThresholdCalculation = ({
    leadTime,
    safetyStockPercentage,
    avgDailySales,
  }) => {
    const leadTimeDays = Number(leadTime);
    const safetyStockPct = Number(safetyStockPercentage) / 100;
    const dailySales = Number(avgDailySales);

    console.log("dailySales", dailySales);

    const safetyStock = safetyStockPct * leadTimeDays * dailySales;
    const newThresholdData = csvData.map((row) => ({
      date: row.date,
      inventory_level: row.inventory_level,
      threshold: leadTimeDays * dailySales + safetyStock,
    }));

    setThresholdData(newThresholdData);
  };

  return (
    <div className="inv_dashboard">
      <h1 className="inv_dashboard__title">Inventory Management Dashboard</h1>

      {/* CSV Upload */}
      <div className="inv_dashboard__dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop CSV file here, or click to select</p>
      </div>

      {uploading && <p className="inv_dashboard__status">Uploading...</p>}
      {error && <p className="inv_dashboard__error">{error}</p>}

      {/* Inventory Stats Section */}
      <InventoryStats data={csvData} />

      <div className="inv_dashboard__bottom-section">
        {/* Chart Visualization */}
        <div className="inv_dashboard__chart">
          <Chart data={csvData} thresholdData={thresholdData} />
        </div>

        {/* Form for Threshold Parameters */}
        <ThresholdForm
          initialData={{ avgDailySales }}
          onCalculate={handleThresholdCalculation}
        />
      </div>
    </div>
  );
};

export default InventoryDashboard;
