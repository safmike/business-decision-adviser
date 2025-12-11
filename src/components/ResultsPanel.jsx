import React from "react";
import MetricTile from "./MetricTile";
import InsightRow from "./InsightRow";
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
          Adjust the numbers above and run the analysis to see an overall
          sensibility score and key insights about this vehicle purchase.
        </p>
      </div>
    );
  }

  const gaugeColor =
    result.overallScore >= 75
      ? "#16a34a"
      : result.overallScore >= 45
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

      {/* Overall score "gauge" */}
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
          Overall Sensibility Score
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
                {result.overallScore}
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
            {result.verdict}
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
        <MetricTile label="Tax Efficiency" value={result.taxEfficiencyScore} />
        <MetricTile label="Cash Flow" value={result.cashFlowScore} />
        <MetricTile label="Financial Safety" value={result.safetyScore} />
      </div>

      {/* Commentary */}
      <div style={resultsCardStyle}>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 13,
            color: "#111827",
          }}
        >
          Here's what the numbers tell us about this{" "}
          {formData.vehiclePrice ? `$${formData.vehiclePrice}` : "proposed"}{" "}
          vehicle purchase:
        </p>

        <InsightRow
          icon="✅"
          title="Tax & structure"
          body={result.commentary.tax}
        />
        <InsightRow
          icon="💸"
          title="Cash flow"
          body={`${result.commentary.cash} Estimated net income: $${result.netIncome}.`}
        />
        <InsightRow
          icon="🛟"
          title="Safety & buffer"
          body={`${result.commentary.reserves} Current reserves: $${formData.cashReserves || 0}.`}
        />

        <p
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          These outputs are illustrative only and do not constitute financial
          advice. Final logic will be refined with professional accounting
          input.
        </p>
      </div>
    </div>
  );
};

export default ResultsPanel;