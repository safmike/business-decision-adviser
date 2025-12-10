import React, { useState } from "react";

const PRIMARY = "#4f46e5";
const PRIMARY_LIGHT = "#eef2ff";
const CARD_RADIUS = 20;

function App() {
  const [screen, setScreen] = useState("landing"); // 'landing' | 'decisionType' | 'analysis'

  const [formData, setFormData] = useState({
    vehiclePrice: "",
    businessUse: 80,
    paymentMethod: "finance",
    loanTerm: 5,
    interestRate: 7.5,
    annualIncome: "",
    annualExpenses: "",
    cashReserves: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (field) => (e) => {
    const { type, value } = e.target;
    const numericTypes = ["number", "range"];
    const parsed =
      numericTypes.includes(type) && value !== "" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [field]: parsed,
    }));
  };

  const handlePaymentMethodClick = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const calculateResults = () => {
    const price = Number(formData.vehiclePrice) || 0;
    const income = Number(formData.annualIncome) || 0;
    const expenses = Number(formData.annualExpenses) || 0;
    const reserves = Number(formData.cashReserves) || 0;
    const businessUse = Number(formData.businessUse) || 0;

    const netIncome = income - expenses;
    const priceToNetIncome = netIncome > 0 ? price / netIncome : null;

    // Very rough demo “scores” – placeholder until accountant logic goes in
    let baseScore =
      price === 0 || netIncome <= 0
        ? 10
        : Math.max(0, Math.min(100, (netIncome / price) * 14 * (businessUse / 100)));

    const taxEfficiencyScore = Math.round(
      Math.max(0, Math.min(100, businessUse + 20))
    );
    const cashFlowScore = Math.round(
      Math.max(0, Math.min(100, baseScore + (reserves > price * 0.2 ? 10 : 0)))
    );
    const safetyScore = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          (reserves / (price * 0.3 || 1)) * 60 + (netIncome > 0 ? 20 : 0)
        )
      )
    );

    const overallScore = Math.round(
      (taxEfficiencyScore + cashFlowScore + safetyScore) / 3
    );

    let verdict;
    if (overallScore >= 75) {
      verdict =
        "Green – on these numbers, this looks broadly comfortable, subject to detailed advice.";
    } else if (overallScore >= 45) {
      verdict =
        "Amber – this could be workable, but it warrants a closer look at cash flow and risk.";
    } else {
      verdict =
        "Red – on these inputs, this decision looks financially tight and may not be sensible.";
    }

    setResult({
      netIncome: Math.round(netIncome),
      priceToNetIncome:
        priceToNetIncome !== null ? priceToNetIncome.toFixed(1) : "n/a",
      overallScore,
      taxEfficiencyScore,
      cashFlowScore,
      safetyScore,
      verdict,
      commentary: {
        tax:
          businessUse >= 50
            ? "At this business-use level, a large portion of running costs should be deductible."
            : "With lower business-use, tax benefits will be more limited.",
        cash:
          netIncome > 0
            ? "Positive net income suggests the vehicle could be supported by current cash flow."
            : "Negative or low net income suggests cash flow pressure.",
        reserves:
          reserves >= price * 0.2
            ? "Reserves look reasonable relative to the vehicle cost."
            : "Reserves look light – there may be limited cushion for shocks.",
      },
    });
  };

  const renderBackLink = (onClick) => (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: PRIMARY,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        marginBottom: 12,
      }}
    >
      <span style={{ fontSize: 15 }}>←</span>
      <span>Back</span>
    </button>
  );

  const renderLanding = () => (
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

          <button
            onClick={() => setScreen("decisionType")}
            style={primaryButtonStyle}
          >
            Analyze a Decision
          </button>
        </div>
      </div>
    </div>
  );

  const renderDecisionType = () => (
    <div style={outerShellStyle}>
      <div style={centerContainerStyle}>
        <div style={cardStyle}>
          {renderBackLink(() => setScreen("landing"))}

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
            onClick={() => setScreen("analysis")}
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

  const renderAnalysis = () => (
    <div style={outerShellStyle}>
      <div style={scrollContainerStyle}>
        <div style={cardStyle}>
          {renderBackLink(() => setScreen("decisionType"))}

          <h1
            style={{
              margin: "0 0 4px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Vehicle Purchase Analysis
          </h1>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Tell us about the vehicle and your business. We’ll run a quick
            sensibility check on the numbers.
          </p>

          {/* PURCHASE DETAILS */}
          <h2 style={sectionTitleStyle}>Purchase Details</h2>

          <div style={fieldGroupStyle}>
            <LabeledInput
              label="Vehicle Price ($)"
              placeholder="e.g. 65,000"
              type="number"
              value={formData.vehiclePrice}
              onChange={handleChange("vehiclePrice")}
            />

            <div style={fieldBlockStyle}>
              <label style={labelStyle}>Business Use (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.businessUse}
                onChange={handleChange("businessUse")}
                style={{ width: "100%" }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: 12,
                  marginTop: 4,
                  color: "#111827",
                }}
              >
                {formData.businessUse}%
              </div>
            </div>

            <div style={fieldBlockStyle}>
              <label style={labelStyle}>Payment Method</label>
              <div style={segmentedControlRowStyle}>
                {["cash", "finance", "split"].map((method) => {
                  const active = formData.paymentMethod === method;
                  const label =
                    method === "cash"
                      ? "Cash"
                      : method === "finance"
                      ? "Finance"
                      : "Split";
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handlePaymentMethodClick(method)}
                      style={{
                        flex: 1,
                        padding: "8px 4px",
                        borderRadius: 999,
                        border: active
                          ? `1px solid ${PRIMARY}`
                          : "1px solid #e5e7eb",
                        backgroundColor: active ? PRIMARY_LIGHT : "white",
                        color: active ? PRIMARY : "#111827",
                        fontSize: 12,
                        fontWeight: active ? 600 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={twoColRowStyle}>
              <LabeledInput
                label="Loan Term (years)"
                placeholder="e.g. 5"
                type="number"
                value={formData.loanTerm}
                onChange={handleChange("loanTerm")}
              />
              <LabeledInput
                label="Interest Rate (%)"
                placeholder="e.g. 7.5"
                type="number"
                value={formData.interestRate}
                onChange={handleChange("interestRate")}
              />
            </div>
          </div>

          {/* BUSINESS DETAILS */}
          <h2 style={{ ...sectionTitleStyle, marginTop: 22 }}>Your Business</h2>

          <div style={fieldGroupStyle}>
            <LabeledInput
              label="Annual Income ($)"
              placeholder="e.g. 180,000"
              type="number"
              value={formData.annualIncome}
              onChange={handleChange("annualIncome")}
            />
            <LabeledInput
              label="Annual Expenses ($)"
              placeholder="e.g. 120,000"
              type="number"
              value={formData.annualExpenses}
              onChange={handleChange("annualExpenses")}
            />
            <LabeledInput
              label="Current Cash Reserves ($)"
              placeholder="e.g. 30,000"
              type="number"
              value={formData.cashReserves}
              onChange={handleChange("cashReserves")}
            />
          </div>

          {/* BUTTON */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button onClick={calculateResults} style={primaryButtonStyle}>
              Analyze Decision
            </button>
          </div>

          {/* RESULTS */}
          <ResultsPanel result={result} formData={formData} />
        </div>
      </div>
    </div>
  );

  if (screen === "landing") return renderLanding();
  if (screen === "decisionType") return renderDecisionType();
  return renderAnalysis();
}

/* ---------- Small Presentational Components ---------- */

function LabeledInput({ label, placeholder, type, value, onChange }) {
  return (
    <div style={fieldBlockStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function ResultsPanel({ result, formData }) {
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

      {/* Overall score “gauge” */}
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
          Here’s what the numbers tell us about this{" "}
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
}

function MetricTile({ label, value }) {
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
}

function InsightRow({ icon, title, body }) {
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
}

/* ---------- Shared Styles ---------- */

const outerShellStyle = {
  minHeight: "100vh",
  margin: 0,
  padding: 16,
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  background:
    "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(16,185,129,0.08))",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

const centerContainerStyle = {
  width: "100%",
  maxWidth: 420,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const scrollContainerStyle = {
  width: "100%",
  maxWidth: 520,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const cardStyle = {
  width: "100%",
  backgroundColor: "white",
  borderRadius: CARD_RADIUS,
  padding: 22,
  boxShadow:
    "0 20px 50px rgba(15,23,42,0.16), 0 1px 3px rgba(15,23,42,0.12)",
};

const primaryButtonStyle = {
  padding: "10px 18px",
  borderRadius: 999,
  border: "none",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  background: PRIMARY,
  color: "white",
  boxShadow: "0 10px 25px rgba(79,70,229,0.45)",
};

const sectionTitleStyle = {
  margin: "10px 0 6px",
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const fieldBlockStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontSize: 12,
  color: "#4b5563",
  marginBottom: 4,
};

const inputStyle = {
  padding: "8px 10px",
  fontSize: 13,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
};

const segmentedControlRowStyle = {
  display: "flex",
  gap: 6,
  marginTop: 2,
  backgroundColor: "#f9fafb",
  padding: 3,
  borderRadius: 999,
};

const twoColRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 10,
};

const resultsCardStyle = {
  marginTop: 6,
  borderRadius: 14,
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  padding: 12,
};

export default App;
