import React from "react";
import BackButton from "../components/BackButton.jsx";
import {
  outerShellStyle,
  centerContainerStyle,
  cardStyle,
  PRIMARY,
  PRIMARY_LIGHT,
} from "../styles";

const DecisionTypeScreen = ({ onBack, onSelectVehicle }) => {
  return (
    <div style={outerShellStyle}>
      <div style={centerContainerStyle}>
        <div style={enhancedCardStyle}>
          <BackButton onClick={onBack} />

          <div style={headerStyle}>
            <h1 style={titleStyle}>What would you like to analyze?</h1>
            <p style={subtitleStyle}>
              Select the type of business decision you need help with.
            </p>
          </div>

          <div style={decisionGridStyle}>
            <DecisionCard
              icon="🚐"
              title="Vehicle Purchase"
              description="Analyze tax implications, cash flow, and total cost of ownership"
              badge="Most Popular"
              onClick={onSelectVehicle}
            />

            <DecisionCard
              icon="🏢"
              title="Equipment Purchase"
              description="Coming soon - evaluate machinery and equipment investments"
              disabled
            />

            <DecisionCard
              icon="👥"
              title="Hiring Decision"
              description="Coming soon - assess the financial impact of new employees"
              disabled
            />

            <DecisionCard
              icon="📍"
              title="Lease vs Buy"
              description="Coming soon - compare leasing against purchasing decisions"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DecisionCard = ({ icon, title, description, badge, disabled, onClick }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        ...cardButtonStyle,
        ...(disabled ? disabledCardStyle : {}),
      }}
    >
      {badge && (
        <div style={badgeStyle}>
          <span style={{ fontSize: 10, fontWeight: 600 }}>{badge}</span>
        </div>
      )}
      
      <div style={cardIconStyle}>
        <span style={{ fontSize: 32, filter: disabled ? "grayscale(1) opacity(0.4)" : "none" }}>
          {icon}
        </span>
      </div>
      
      <div style={{ textAlign: "left" }}>
        <h3 style={cardTitleStyle}>{title}</h3>
        <p style={cardDescriptionStyle}>{description}</p>
      </div>
      
      {!disabled && (
        <div style={arrowContainerStyle}>
          <span style={{ fontSize: 20, color: PRIMARY }}>→</span>
        </div>
      )}
    </button>
  );
};

// ========== ENHANCED STYLES ==========

const enhancedCardStyle = {
  ...cardStyle,
  background: "linear-gradient(to bottom, #ffffff, #fafafa)",
  boxShadow: "0 25px 60px rgba(15,23,42,0.12), 0 5px 15px rgba(15,23,42,0.08)",
  maxWidth: 600,
};

const headerStyle = {
  textAlign: "center",
  marginBottom: 28,
  paddingBottom: 20,
  borderBottom: "2px solid #f3f4f6",
};

const titleStyle = {
  margin: "0 0 8px",
  fontSize: 24,
  fontWeight: 700,
  background: "linear-gradient(135deg, #1e293b, #334155)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const subtitleStyle = {
  margin: 0,
  fontSize: 14,
  color: "#64748b",
  lineHeight: 1.5,
};

const decisionGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 14,
};

const cardButtonStyle = {
  width: "100%",
  borderRadius: 16,
  padding: "20px",
  border: "2px solid #e5e7eb",
  backgroundColor: "white",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: 16,
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
  position: "relative",
  textAlign: "left",
};

const disabledCardStyle = {
  opacity: 0.6,
  cursor: "not-allowed",
  backgroundColor: "#f9fafb",
};

const badgeStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  backgroundColor: PRIMARY,
  color: "white",
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 10,
  fontWeight: 600,
};

const cardIconStyle = {
  width: 56,
  height: 56,
  borderRadius: 14,
  backgroundColor: PRIMARY_LIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${PRIMARY}20`,
};

const cardTitleStyle = {
  margin: "0 0 6px",
  fontSize: 16,
  fontWeight: 600,
  color: "#1e293b",
};

const cardDescriptionStyle = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.5,
};

const arrowContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default DecisionTypeScreen;