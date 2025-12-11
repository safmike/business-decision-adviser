import React from "react";

const MetricTile = ({ label, value }) => {
  return (
    <div
      style={{
        borderRadius: 14,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        padding: 10,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default MetricTile;