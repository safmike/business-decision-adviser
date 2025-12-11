import React from "react";
import MetricTile from "./MetricTile.jsx";
import InsightRow from "./InsightRow.jsx";
import { resultsCardStyle } from "../styles";

const ResultsPanel = ({ result, formData }) => {
  if (!result) {
    return (
      <div style={resultsCardStyle}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Complete the form above and click "Analyze Decision" to see a
          comprehensive financial analysis of this vehicle purchase.
        </p>
      </div>
    );
  }

  const gaugeColor =
    result.overall >= 75
      ? "#16a34a"
      : result.overall >= 45
      ? "#f59e0b"
      : "#dc2626";

  return (
    <div style={{ marginTop: 22 }}>
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Analysis Results
      </h2>

      {/* Overall score gauge */}
      <div
        style={{
          borderRadius: 16,
          backgroundColor: "#ecfdf3",
          padding: 16,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            color: "#166534",
          }}
        >
          Overall Decision Score
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: `6px solid ${gaugeColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: gaugeColor,
                }}
              >
                {result.overall}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                out of 100
              </div>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#166534",
            }}
          >
            {result.summary}
          </p>
        </div>
      </div>

      {/* Three metric tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <MetricTile label="Tax Efficiency" value={result.taxScore} />
        <MetricTile label="Cash Flow" value={result.cashFlowScore} />
        <MetricTile label="Financial Safety" value={result.safetyScore} />
      </div>

      {/* Key Financial Metrics */}
      <div style={resultsCardStyle}>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Key Financial Metrics
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 16px",
            fontSize: 12,
          }}
        >
          <MetricRow
            label="Monthly Payment"
            value={`$${Number(result.monthlyPayment).toLocaleString()}`}
          />
          <MetricRow
            label="Running Costs/Month"
            value={`$${Number(result.monthlyRunningCost).toLocaleString()}`}
          />
          <MetricRow
            label="Total Interest"
            value={`$${Number(result.totalInterest).toLocaleString()}`}
          />
          <MetricRow
            label="Total Running Costs"
            value={`$${Number(result.totalRunningCosts).toLocaleString()}`}
          />
          <MetricRow
            label="Tax Savings (Year 1)"
            value={`$${Number(result.taxSavingsYear1).toLocaleString()}`}
            highlight
          />
          <MetricRow
            label="Total Tax Savings"
            value={`$${Number(result.totalTaxSavings).toLocaleString()}`}
            highlight
          />
          <MetricRow
            label="Cash After Purchase"
            value={`$${Number(result.cashAfterPurchase).toLocaleString()}`}
          />
          <MetricRow
            label="Months of Reserves"
            value={result.monthsOfReserves}
          />
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <MetricRow
            label="Total Cost of Ownership"
            value={`$${Number(result.totalCostOfOwnership).toLocaleString()}`}
            large
          />
        </div>
      </div>

      {/* Tax Position */}
      <div style={{ ...resultsCardStyle, marginTop: 10 }}>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Tax Position
        </h3>
        
        {result.instantWriteOffEligible ? (
          <div
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>
              ✓ Instant Asset Write-Off Eligible
            </div>
            <div style={{ fontSize: 11, color: "#166534", marginTop: 2 }}>
              Full deduction in year 1 (under $20,000 threshold)
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#fef3c7",
              border: "1px solid #fde047",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>
              Depreciation Method
            </div>
            <div style={{ fontSize: 11, color: "#92400e", marginTop: 2 }}>
              Tax deductions spread over ownership period
            </div>
          </div>
        )}

        {result.hasLCT && (
          <div
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#991b1b" }}>
              ⚠ Luxury Car Tax Applies
            </div>
            <div style={{ fontSize: 11, color: "#991b1b", marginTop: 2 }}>
              Additional ${Number(result.lctAmount).toLocaleString()} LCT on top of
              vehicle price
            </div>
          </div>
        )}
      </div>

      {/* Risk Flags */}
      {result.riskFlags && result.riskFlags.length > 0 && (
        <div style={{ ...resultsCardStyle, marginTop: 10 }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Risk Assessment
          </h3>
          {result.riskFlags.map((flag, idx) => (
            <RiskFlag key={idx} flag={flag} />
          ))}
        </div>
      )}

      {/* Positive Flags */}
      {result.positiveFlags && result.positiveFlags.length > 0 && (
        <div style={{ ...resultsCardStyle, marginTop: 10 }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 600,
              color: "#059669",
            }}
          >
            Positive Indicators
          </h3>
          {result.positiveFlags.map((flag, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "8px 10px",
                borderRadius: 8,
                backgroundColor: "#d1fae5",
                border: "1px solid #86efac",
                marginBottom: 6,
                fontSize: 12,
                color: "#065f46",
              }}
            >
              <span style={{ fontSize: 16 }}>✓</span>
              <span>{flag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Flags */}
      {result.opportunityFlags && result.opportunityFlags.length > 0 && (
        <div style={{ ...resultsCardStyle, marginTop: 10 }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0369a1",
            }}
          >
            Opportunities to Consider
          </h3>
          {result.opportunityFlags.map((flag, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "8px 10px",
                borderRadius: 8,
                backgroundColor: "#e0f2fe",
                border: "1px solid #7dd3fc",
                marginBottom: 6,
                fontSize: 12,
                color: "#0c4a6e",
              }}
            >
              <span style={{ fontSize: 16 }}>💡</span>
              <span>{flag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ ...resultsCardStyle, marginTop: 10 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "#9ca3af",
            fontStyle: "italic",
          }}
        >
          These outputs are for illustrative purposes only and do not
          constitute financial or tax advice. Consult with a qualified
          accountant or financial advisor before making any decisions.
        </p>
      </div>
    </div>
  );
};

// Helper component for metric rows
const MetricRow = ({ label, value, highlight, large }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{
        color: "#6b7280",
        fontSize: large ? 13 : 11,
        fontWeight: large ? 600 : 400,
      }}
    >
      {label}
    </span>
    <span
      style={{
        color: highlight ? "#059669" : "#111827",
        fontWeight: highlight || large ? 600 : 500,
        fontSize: large ? 14 : 12,
      }}
    >
      {value}
    </span>
  </div>
);

// Helper component for risk flags
const RiskFlag = ({ flag }) => {
  const colors = {
    critical: {
      bg: "#fee2e2",
      border: "#fca5a5",
      text: "#991b1b",
      icon: "🚨",
    },
    warning: {
      bg: "#fef3c7",
      border: "#fde047",
      text: "#92400e",
      icon: "⚠️",
    },
    advisory: {
      bg: "#dbeafe",
      border: "#93c5fd",
      text: "#1e40af",
      icon: "ℹ️",
    },
  };

  const style = colors[flag.severity] || colors.advisory;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "8px 10px",
        borderRadius: 8,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        marginBottom: 6,
        fontSize: 12,
        color: style.text,
      }}
    >
      <span style={{ fontSize: 16 }}>{style.icon}</span>
      <span>{flag.message}</span>
    </div>
  );
};

export default ResultsPanel;