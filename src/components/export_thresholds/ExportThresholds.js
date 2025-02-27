import React from "react";

const ExportThresholds = ({ thresholdData }) => {
  // Function to convert thresholdData to CSV format
  const convertToCSV = (data) => {
    const headers = [
      "Date",
      "Product ID",
      "Product Name",
      "Safety Stock Threshold",
      "Replenishment Threshold",
      "Restock Threshold",
    ];
    const rows = data.map((row) => [
      row.date,
      row.product_id,
      row.product_name,
      row.safetyStockThreshold,
      row.replenishmentThreshold,
      row.restockThreshold,
    ]);

    // Combine headers and rows into CSV string
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    return csvContent;
  };

  // Function to trigger download of CSV
  const downloadCSV = () => {
    const csvContent = convertToCSV(thresholdData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "threshold_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={downloadCSV}
      style={{
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Export Thresholds as CSV
    </button>
  );
};

export default ExportThresholds;
