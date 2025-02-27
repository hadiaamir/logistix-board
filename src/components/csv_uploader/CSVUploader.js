"use client";

import http, { uploadFile } from "@/utils/http";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Papa from "papaparse";

export default function CSVUploader() {
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Function to handle file drop
  const handleFileDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;


    console.log('file', file)

    setUploading(true);
    setError(null);

    try {
      console.log('now uploadeing')
      const response = await uploadFile({route: "/upload", formData: file}); // Pass file, not FormData


 

      if (response.error) {
        setError(response.error);
      } else {
        setChartData(response.thresholds || []);
      }
    } catch (err) {
      setError("Error uploading or processing CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    accept: ".csv",
    multiple: false,
  });

  return (
    <div>
      <div {...getRootProps()} className="border p-4 rounded-lg text-center cursor-pointer bg-gray-100">
        <input {...getInputProps()} />
        <p>{uploading ? "Uploading..." : "Drag & drop a CSV file here, or click to select one"}</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {chartData.length > 0 && (
        <>
          <ThresholdChart data={chartData} />
          <button
            onClick={() => exportThresholds(chartData)}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Export Thresholds as CSV
          </button>
        </>
      )}
    </div>
  );
}

// Threshold chart component
const ThresholdChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="inventory_level" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="lowThreshold" stroke="#ff7300" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="mediumThreshold" stroke="#82ca9d" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="highThreshold" stroke="#ff0000" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Function to export thresholds as CSV
const exportThresholds = (thresholdData) => {
  const csv = Papa.unparse(thresholdData);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "thresholds.csv";
  link.click();
};
