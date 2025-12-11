import React from "react";
import BackButton from "../components/BackButton";
import {
  outerShellStyle,
  centerContainerStyle,
  cardStyle,
  PRIMARY_LIGHT,
} from "../styles";

const DecisionTypeScreen = ({ onBack, onSelectVehicle }) => {
  return (
    <div style={outerShellStyle}>
      <div style={centerContainerStyle}>
        <div style={cardStyle}>
          <BackButton onClick={onBack} />

          <h1
            style={{
              margin: "0 0 4px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            What decision are you analyzing?
          </h1>
          <p
            style={{
              margin: "0 0 18px",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Select the type of business decision you need help with.
          </p>

          <button
            onClick={onSelectVehicle}
            style={{
              width: "100%",
              borderRadius: 18,
              padding: "14px 16px",
              border: "1.5px solid #e5e7eb",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: PRIMARY_LIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🚐
              </span>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Vehicle Purchase
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginTop: 2,
                  }}
                >
                  Sense-check a business vehicle acquisition before committing.
                </div>
              </div>
            </div>
            <span style={{ fontSize: 18, color: "#9ca3af" }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionTypeScreen;