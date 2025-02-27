"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import http from "@/utils/http.js";
import ThresholdForm from "../threshold_form/ThresholdForm";
import Chart from "../chart/Chart";
import "./InventoryDashboard.scss";
import InventoryStats from "../inventory_stats/InventoryStats";
import ExportThresholds from "../export_thresholds/ExportThresholds";

const InventoryDashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [thresholdData, setThresholdData] = useState([]);
  const [avgDailySales, setAvgDailySales] = useState(0);

  /**
   * Handles file upload using the `react-dropzone` library for CSV files.
   * The uploaded CSV file is processed to calculate the average daily sales and
   * make a POST request to the backend for file storage. It also calculates the thresholds
   * based on the CSV data and updates the state accordingly.
   */
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv", // Restrict accepted file types to .csv
    onDrop: async (acceptedFiles) => {
      // Return early if no files are dropped
      if (acceptedFiles.length === 0) return;

      const csvFile = acceptedFiles[0]; // Extract the first file from the dropped files
      const reader = new FileReader(); // Create a new FileReader instance

      reader.onload = async () => {
        const formData = new FormData(); // Create a new FormData object
        formData.append("file", csvFile); // Append the CSV file to the FormData

        try {
          setUploading(true); // Set uploading state to true
          setError(null); // Clear any previous errors

          // Send the file to the server via POST request
          const response = await http.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }, // Set appropriate content-type for file upload
          });

          setCsvData(response.data); // Store the uploaded data in the state

          // Calculate the average daily sales from the uploaded data
          const totalSales = response.data.reduce(
            (sum, row) => sum + row.orders, // Sum all the orders
            0
          );
          const avgDailySales = response.data.length
            ? totalSales / response.data.length
            : 0; // Calculate average sales per day
          setAvgDailySales(avgDailySales); // Store the average daily sales

          console.log("avgDailySales", avgDailySales);

          // Calculate dynamic thresholds
          handleThresholdCalculation({
            leadTime: 5, // Example, replace with actual data from form/input
            safetyStockPercentage: 20, // Example, replace with actual data from form/input
            avgDailySales: avgDailySales,
          });

          setThresholdData([]); // Reset threshold data since new data is uploaded
        } catch (err) {
          console.error("Upload failed:", err); // Log any errors during upload
          setError("Upload failed. Please try again."); // Display error message
        } finally {
          setUploading(false); // Set uploading state back to false once the process is complete
        }
      };

      reader.readAsText(csvFile); // Start reading the file as text
    },
  });

  const handleThresholdCalculation = ({
    leadTime,
    safetyStockPercentage,
    avgDailySales,
  }) => {
    // Convert inputs to numeric values
    const leadTimeDays = Number(leadTime); // Ensure leadTime is a number
    const safetyStockPct = Number(safetyStockPercentage) / 100; // Convert percentage to decimal
    const dailySales = Number(avgDailySales); // Ensure avgDailySales is a number

    // Calculate the safety stock using the provided percentage and lead time
    const safetyStock = safetyStockPct * leadTimeDays * dailySales;

    // Calculate the replenishment threshold (e.g., safety stock + 10% buffer)
    const replenishmentThreshold = safetyStock * 1.1; // Adding 10% buffer for replenishment

    // Calculate the restock threshold (e.g., safety stock + 20% buffer)
    const restockThreshold = safetyStock * 1.2; // Adding 20% buffer for restock

    // Map through the CSV data and calculate thresholds for each row
    const newThresholdData = csvData.map((row) => ({
      date: row.date, // Keep the original date from the CSV data
      inventory_level: row.inventory_level, // Keep the original inventory level from the CSV data
      safetyStockThreshold: safetyStock, // Dynamic safety stock threshold
      replenishmentThreshold, // Dynamic replenishment threshold
      restockThreshold, // Dynamic restock threshold
      calculatedThreshold: leadTimeDays * dailySales + safetyStock, // Overall threshold
    }));

    console.log("newThresholdData", newThresholdData);

    // Update the state with the calculated threshold data
    setThresholdData(newThresholdData); // Store the new threshold data
  };

  return (
    <div className="inv_dashboard">
      <div className="inv_dashboard__hd">
        <h1 className="inv_dashboard__hd__title">
          Inventory Management Dashboard
        </h1>

        {/* CSV Upload */}
        <div className="inv_dashboard__hd__dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag & drop CSV file here, or click to select</p>
        </div>
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

      {/* Export Button for Thresholds */}
      <ExportThresholds thresholdData={thresholdData} />
    </div>
  );
};

export default InventoryDashboard;
