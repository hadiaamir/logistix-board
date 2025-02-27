// components/inventory_stats/InventoryStats.js
import React from "react";
import "./InventoryStats.scss";

const InventoryStats = ({ data }) => {
  let totalOrders = 0;
  let averageOrdersPerDay = 0;
  let averageInventory = 0;
  let salesTrend = 0;
  let daysOfInventory = 0;

  if (data && data.length > 0) {
    totalOrders = data.reduce((sum, row) => sum + row.orders, 0);
    averageOrdersPerDay = totalOrders / data.length;
    averageInventory =
      data.reduce((sum, row) => sum + row.inventory_level, 0) / data.length;

    const firstDayOrders = data[0].orders;
    const lastDayOrders = data[data.length - 1].orders;
    salesTrend = firstDayOrders
      ? ((lastDayOrders - firstDayOrders) / firstDayOrders) * 100
      : 0;

    const daysOfInventoryArray = data.map((row) =>
      row.orders ? row.inventory_level / row.orders : 0
    );
    daysOfInventory =
      daysOfInventoryArray.reduce((sum, value) => sum + value, 0) /
      daysOfInventoryArray.length;
  }

  return (
    <div className="inventory-stats">
      <div className="inventory-stats__content">
        <div className="inventory-stats__content__item">
          <div className="inventory-stats__content__item__label">
            Total Orders:
          </div>{" "}
          <div className="inventory-stats__content__item__value">
            {totalOrders}
          </div>
        </div>
        <div className="inventory-stats__content__item">
          <div className="inventory-stats__content__item__label">
            Average Orders per Day:
          </div>
          <div className="inventory-stats__content__item__value">
            {averageOrdersPerDay.toFixed(2)}
          </div>
        </div>
        <div className="inventory-stats__content__item">
          <div className="inventory-stats__content__item__label">
            Average Inventory Level:
          </div>
          <div className="inventory-stats__content__item__value">
            {averageInventory.toFixed(2)}
          </div>
        </div>
        <div className="inventory-stats__content__item">
          <div className="inventory-stats__content__item__label">
            Sales Trend (Change in Orders):
          </div>
          <div className="inventory-stats__content__item__value">
            {salesTrend.toFixed(2)}%
          </div>
        </div>
        <div className="inventory-stats__content__item">
          <div className="inventory-stats__content__item__label">
            Days of Inventory:
          </div>
          <div className="inventory-stats__content__item__value">
            {daysOfInventory.toFixed(2)} days
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
