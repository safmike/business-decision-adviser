import React from "react";
import {
  outerShellStyle,
  centerContainerStyle,
  cardStyle,
  primaryButtonStyle,
  PRIMARY_LIGHT,
} from "../styles";

const LandingScreen = ({ onNext }) => {
  return (
    <div style={outerShellStyle}>
      <div style={centerContainerStyle}>
        <div style={cardStyle}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              backgroundColor: PRIMARY_LIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <span style={{ fontSize: 30 }}>📊</span>
          </div>
          <h1
            style={{
              textAlign: "center",
              margin: "0 0 6px",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Business Decision Advisor
          </h1>
          <p
            style={{
              textAlign: "center",
              margin: "0 0 20px",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            Make smarter financial decisions for your business with instant
            analysis and simple, practical guidance.
          </p>

          <button onClick={onNext} style={primaryButtonStyle}>
            Analyze a Decision
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;