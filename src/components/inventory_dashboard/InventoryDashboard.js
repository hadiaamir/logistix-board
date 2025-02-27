"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import http from "@/utils/http.js";
import ThresholdForm from "../threshold_form/ThresholdForm";
import Chart from "../chart/Chart";
import "./InventoryDashboard.scss";
import InventoryStats from "../inventory_stats/InventoryStats";

const InventoryDashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [thresholdData, setThresholdData] = useState([]);
  const [avgDailySales, setAvgDailySales] = useState(0);

  /**
   * Handles file upload using the `react-dropzone` library for CSV files.
   * The uploaded CSV file is processed to calculate the average daily sales and
   * make a POST request to the backend for file storage.
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
          setAvgDailySales(
            response.data.length ? totalSales / response.data.length : 0 // Calculate average sales per day
          );
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

  /**
   * Calculates the inventory threshold based on lead time, safety stock percentage, and average daily sales.
   * The threshold is then stored in the state for later use, applying the calculation to each row in the CSV data.
   *
   * @param {Object} params - The input parameters for the calculation.
   * @param {number} params.leadTime - The number of days needed to fulfill an order (lead time).
   * @param {number} params.safetyStockPercentage - The percentage of safety stock to be kept in inventory.
   * @param {number} params.avgDailySales - The average number of sales per day.
   */
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

    // Map through the CSV data and calculate thresholds for each row
    const newThresholdData = csvData.map((row) => ({
      date: row.date, // Keep the original date from the CSV data
      inventory_level: row.inventory_level, // Keep the original inventory level from the CSV data
      threshold: leadTimeDays * dailySales + safetyStock, // Calculate the inventory threshold
    }));

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
    </div>
  );
};

export default InventoryDashboard;
