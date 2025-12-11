import React from "react";

const InsightRow = ({ icon, title, body }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 6,
      }}
    >
      <div style={{ fontSize: 18, marginTop: 2 }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#4b5563",
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};

export default InsightRow;