"use client";
import { useState, useEffect } from "react";
import "./ThresholdForm.scss";

const ThresholdForm = ({ initialData, onCalculate }) => {
  const [formData, setFormData] = useState({
    leadTime: "",
    safetyStockPercentage: "",
    avgDailySales: initialData.avgDailySales || "", // Set initial avgDailySales from parent
  });

  useEffect(() => {
    // Ensure avgDailySales only gets set once based on the initial data
    if (
      initialData &&
      initialData.avgDailySales !== undefined &&
      formData.avgDailySales === ""
    ) {
      setFormData((prev) => ({
        ...prev,
        avgDailySales: initialData.avgDailySales || "", // Set avgDailySales from parent, but prevent overwriting
      }));
    }
  }, [initialData, formData.avgDailySales]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData); // Send the formData back to parent
  };

  return (
    <form className="threshold-form" onSubmit={handleSubmit}>
      <h2>Inventory Thresholds</h2>

      <label>
        Lead Time (days):
        <input
          type="number"
          name="leadTime"
          value={formData.leadTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Safety Stock Percentage (%):
        <input
          type="number"
          name="safetyStockPercentage"
          value={formData.safetyStockPercentage}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Average Daily Sales:
        <input
          type="number"
          name="avgDailySales"
          value={formData.avgDailySales}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Calculate Threshold</button>
    </form>
  );
};

export default ThresholdForm;
