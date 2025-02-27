export const calculateThresholds = (data, safetyStockPercentage) => {
    return data.map(item => {
      const avgDailySales = item.orders / 30; // Assuming average monthly sales
      const leadTime = item.lead_time_days;
  
      const safetyStock = safetyStockPercentage * avgDailySales * leadTime;
  
      const lowThreshold = avgDailySales * leadTime - safetyStock;
      const mediumThreshold = avgDailySales * leadTime;
      const highThreshold = avgDailySales * leadTime + safetyStock;
  
      return {
        ...item,
        lowThreshold,
        mediumThreshold,
        highThreshold,
      };
    });
  };
  