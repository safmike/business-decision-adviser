import React, { useState } from "react";
import MetricTile from "./MetricTile.jsx";
import InsightRow from "./InsightRow.jsx";
import { resultsCardStyle, PRIMARY } from "../styles";
import { calculateResults } from "../utils/calculations";

const ResultsPanel = ({ result, formData }) => {
  const [showScenarios, setShowScenarios] = useState(false);
  const [showYearByYear, setShowYearByYear] = useState(false);

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

  const       gaugeColor =
    result.overall >= 75
      ? "#16a34a"
      : result.overall >= 45
      ? "#f59e0b"
      : "#dc2626";

  // Generate scenarios for comparison
  const scenarios = generateScenarios(formData, result);
  
  // Generate year-by-year breakdown
  const yearByYearData = generateYearByYear(formData, result);

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
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Tax Position
          <Tooltip text="Tax implications include instant asset write-off eligibility, depreciation deductions, and luxury car tax if applicable." />
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
            <div style={{ fontSize: 12, fontWeight: 600, color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
              ✓ Instant Asset Write-Off Eligible
              <Tooltip text="Businesses with turnover under $10m can claim immediate deduction for assets under $20,000 (as of 2024-25). This means you get the full tax deduction in year 1 instead of spreading it over multiple years." />
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
            <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e", display: "flex", alignItems: "center", gap: 4 }}>
              Depreciation Method
              <Tooltip text="Assets over $20,000 must be depreciated over time using either the diminishing value or prime cost method. Tax deductions are spread across the asset's effective life." />
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
            <div style={{ fontSize: 12, fontWeight: 600, color: "#991b1b", display: "flex", alignItems: "center", gap: 4 }}>
              ⚠ Luxury Car Tax Applies
              <Tooltip text="Luxury Car Tax (LCT) is 33% of the value above the LCT threshold ($91,387 for 2024-25, or $84,916 for fuel-efficient vehicles). This is in addition to GST and the base price." />
            </div>
            <div style={{ fontSize: 11, color: "#991b1b", marginTop: 2 }}>
              Additional ${Number(result.lctAmount).toLocaleString()} LCT on top of
              vehicle price
            </div>
          </div>
        )}
      </div>

      {/* Year-by-Year Breakdown */}
      <div style={{ ...resultsCardStyle, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            📅 Year-by-Year Breakdown
          </h3>
          <button
            onClick={() => setShowYearByYear(!showYearByYear)}
            style={{
              background: "none",
              border: "none",
              color: PRIMARY,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {showYearByYear ? "Hide" : "Show"}
          </button>
        </div>
        
        {showYearByYear && (
          <div style={{ marginTop: 12 }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "8px 4px", textAlign: "left", color: "#6b7280" }}>Year</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", color: "#6b7280" }}>Payments</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", color: "#6b7280" }}>Running</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", color: "#6b7280" }}>Tax Saved</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", color: "#6b7280", fontWeight: 600 }}>Net Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {yearByYearData.map((year, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 4px", fontWeight: 500 }}>{year.year}</td>
                      <td style={{ padding: "8px 4px", textAlign: "right" }}>${year.payments.toLocaleString()}</td>
                      <td style={{ padding: "8px 4px", textAlign: "right" }}>${year.running.toLocaleString()}</td>
                      <td style={{ padding: "8px 4px", textAlign: "right", color: "#059669" }}>-${year.taxSaved.toLocaleString()}</td>
                      <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600 }}>${year.netCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #e5e7eb", fontWeight: 600 }}>
                    <td style={{ padding: "8px 4px" }}>Total</td>
                    <td style={{ padding: "8px 4px", textAlign: "right" }}>${yearByYearData.reduce((sum, y) => sum + y.payments, 0).toLocaleString()}</td>
                    <td style={{ padding: "8px 4px", textAlign: "right" }}>${yearByYearData.reduce((sum, y) => sum + y.running, 0).toLocaleString()}</td>
                    <td style={{ padding: "8px 4px", textAlign: "right", color: "#059669" }}>-${yearByYearData.reduce((sum, y) => sum + y.taxSaved, 0).toLocaleString()}</td>
                    <td style={{ padding: "8px 4px", textAlign: "right" }}>${yearByYearData.reduce((sum, y) => sum + y.netCost, 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 8, marginBottom: 0 }}>
              Shows annual loan payments, running costs, tax savings, and net out-of-pocket cost per year.
            </p>
          </div>
        )}
      </div>

      {/* Scenario Comparison */}
      <div style={{ ...resultsCardStyle, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            🔄 Compare Scenarios
          </h3>
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            style={{
              background: "none",
              border: "none",
              color: PRIMARY,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {showScenarios ? "Hide" : "Show"}
          </button>
        </div>
        
        {showScenarios && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {scenarios.map((scenario, idx) => (
                <ScenarioCard key={idx} scenario={scenario} isCurrent={scenario.isCurrent} />
              ))}
            </div>
            <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 12, marginBottom: 0 }}>
              Quick comparison of alternative scenarios to help optimize your decision.
            </p>
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

// ========== NEW HELPER COMPONENTS ==========

// Tooltip component
const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1px solid #94a3b8",
          background: "#f1f5f9",
          color: "#64748b",
          fontSize: 10,
          fontWeight: 600,
          cursor: "help",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        ?
      </button>
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1e293b",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 11,
            lineHeight: 1.5,
            width: 220,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #1e293b",
            }}
          />
        </div>
      )}
    </div>
  );
};

// Scenario comparison card
const ScenarioCard = ({ scenario, isCurrent }) => {
  const scoreColor = scenario.score >= 75 ? "#16a34a" : scenario.score >= 45 ? "#f59e0b" : "#dc2626";
  
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        border: isCurrent ? `2px solid ${PRIMARY}` : "2px solid #e5e7eb",
        backgroundColor: isCurrent ? "#f0f9ff" : "white",
        position: "relative",
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: PRIMARY,
            color: "white",
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 8,
          }}
        >
          CURRENT
        </div>
      )}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
        {scenario.name}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: scoreColor, marginBottom: 4 }}>
        {scenario.score}
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
        {scenario.description}
      </div>
      <div style={{ fontSize: 10, color: "#059669", fontWeight: 600 }}>
        ${scenario.totalCost.toLocaleString()} total
      </div>
    </div>
  );
};

// Generate scenarios for comparison
const generateScenarios = (formData, currentResult) => {
  const basePrice = Number(formData.vehiclePrice) || 0;
  
  const scenarios = [
    {
      name: "Current",
      isCurrent: true,
      data: formData,
    },
    {
      name: "15% Cheaper",
      isCurrent: false,
      data: { ...formData, vehiclePrice: Math.round(basePrice * 0.85) },
    },
    {
      name: "90% Business",
      isCurrent: false,
      data: { ...formData, businessUse: 90 },
    },
    {
      name: "All Cash",
      isCurrent: false,
      data: { ...formData, paymentMethod: "cash" },
    },
  ];

  return scenarios.map((s) => {
    const result = s.isCurrent ? currentResult : calculateResults(s.data);
    return {
      ...s,
      score: result.overall,
      totalCost: Number(result.totalCostOfOwnership),
      description: s.isCurrent 
        ? `${Number(formData.vehiclePrice).toLocaleString()}, ${formData.businessUse}% business`
        : s.name === "15% Cheaper"
        ? `${s.data.vehiclePrice.toLocaleString()}`
        : s.name === "90% Business"
        ? `${s.data.businessUse}% business use`
        : "No financing costs",
    };
  });
};

// Generate year-by-year breakdown
const generateYearByYear = (formData, result) => {
  const years = Number(formData.ownershipPeriod) || 5;
  const monthlyPayment = Number(result.monthlyPayment) || 0;
  const monthlyRunning = Number(result.monthlyRunningCost) || 0;
  const totalTaxSavings = Number(result.totalTaxSavings) || 0;
  const instantWriteOff = result.instantWriteOffEligible;

  const yearlyData = [];
  
  for (let year = 1; year <= years; year++) {
    const payments = monthlyPayment * 12;
    const running = monthlyRunning * 12;
    
    // Tax savings distribution
    let taxSaved = 0;
    if (instantWriteOff && year === 1) {
      taxSaved = totalTaxSavings;
    } else if (!instantWriteOff) {
      // Distribute depreciation tax savings (diminishing value method approximation)
      const depreciationRate = 0.25; // Rough average
      const remainingYears = years - year + 1;
      taxSaved = totalTaxSavings * (depreciationRate / remainingYears);
    }

    const netCost = payments + running - taxSaved;

    yearlyData.push({
      year: `Year ${year}`,
      payments: Math.round(payments),
      running: Math.round(running),
      taxSaved: Math.round(taxSaved),
      netCost: Math.round(netCost),
    });
  }

  return yearlyData;
};

export default ResultsPanel;