import React from "react";
import {
  outerShellStyle,
  centerContainerStyle,
  cardStyle,
  primaryButtonStyle,
  PRIMARY,
  PRIMARY_LIGHT,
} from "../styles";

const LandingScreen = ({ onNext }) => {
  return (
    <div style={outerShellStyle}>
      <div style={centerContainerStyle}>
        <div style={enhancedCardStyle}>
          <div style={logoContainerStyle}>
            <div style={logoCircleStyle}>
              <span style={{ fontSize: 42 }}>📊</span>
            </div>
            <div style={shimmerStyle} />
          </div>
          
          <h1 style={titleStyle}>
            Business Decision Advisor
          </h1>
          
          <p style={taglineStyle}>
            Your Accountant in Your Pocket
          </p>
          
          <p style={descriptionStyle}>
            Make smarter financial decisions with instant analysis. Get
            professional-grade insights on vehicle purchases, equipment
            investments, and more.
          </p>

          <div style={featureGridStyle}>
            <FeaturePill icon="💰" text="Tax Optimization" />
            <FeaturePill icon="📈" text="Cash Flow Analysis" />
            <FeaturePill icon="⚡" text="Instant Results" />
            <FeaturePill icon="🎯" text="Risk Assessment" />
          </div>

          <button onClick={onNext} style={ctaButtonStyle}>
            <span style={{ fontSize: 18, marginRight: 10 }}>🚀</span>
            Get Started
            <span style={arrowStyle}>→</span>
          </button>

          <p style={disclaimerStyle}>
            Professional insights • No account required • Always free
          </p>
        </div>
      </div>
    </div>
  );
};

const FeaturePill = ({ icon, text }) => (
  <div style={featurePillStyle}>
    <span style={{ fontSize: 16, marginRight: 6 }}>{icon}</span>
    <span style={{ fontSize: 12, fontWeight: 500 }}>{text}</span>
  </div>
);

// ========== ENHANCED STYLES ==========

const enhancedCardStyle = {
  ...cardStyle,
  background: "linear-gradient(to bottom, #ffffff, #fafafa)",
  boxShadow: "0 25px 60px rgba(15,23,42,0.12), 0 5px 15px rgba(15,23,42,0.08)",
  maxWidth: 440,
  position: "relative",
  overflow: "hidden",
};

const logoContainerStyle = {
  position: "relative",
  margin: "0 auto 20px",
  width: "fit-content",
};

const logoCircleStyle = {
  width: 90,
  height: 90,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${PRIMARY}, #6366f1)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 15px 40px rgba(79,70,229,0.35)",
  position: "relative",
  zIndex: 2,
};

const shimmerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 110,
  height: 110,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${PRIMARY_LIGHT}, transparent)`,
  opacity: 0.4,
  zIndex: 1,
};

const titleStyle = {
  textAlign: "center",
  margin: "0 0 8px",
  fontSize: 28,
  fontWeight: 700,
  background: "linear-gradient(135deg, #1e293b, #334155)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const taglineStyle = {
  textAlign: "center",
  margin: "0 0 16px",
  fontSize: 16,
  fontWeight: 600,
  color: PRIMARY,
};

const descriptionStyle = {
  textAlign: "center",
  margin: "0 0 24px",
  fontSize: 14,
  color: "#64748b",
  lineHeight: 1.6,
};

const featureGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 28,
};

const featurePillStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 12px",
  borderRadius: 12,
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
};

const ctaButtonStyle = {
  ...primaryButtonStyle,
  width: "100%",
  fontSize: 16,
  padding: "14px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 15px 35px rgba(79,70,229,0.35)",
};

const arrowStyle = {
  marginLeft: "auto",
  fontSize: 18,
  fontWeight: "bold",
};

const disclaimerStyle = {
  textAlign: "center",
  marginTop: 20,
  fontSize: 11,
  color: "#94a3b8",
};

export default LandingScreen;