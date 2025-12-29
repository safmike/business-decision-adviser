import React, { useEffect, useRef } from "react";
import { generateVehicleScenarios } from "../logic/vehicle/scenarios.js";
import BackButton from "../components/BackButton.jsx";
import LabeledInput from "../components/LabeledInput.jsx";
import ResultsPanel from "../components/ResultsPanel.jsx";
import { runVehicleEngine } from "../logic/vehicle/engine.js";
import { useDecision } from "../contexts/DecisionContext.jsx";
import {
  outerShellStyle,
  scrollContainerStyle,
  cardStyle,
  sectionTitleStyle,
  fieldGroupStyle,
  fieldBlockStyle,
  labelStyle,
  primaryButtonStyle,
  PRIMARY,
  PRIMARY_LIGHT,
  inputStyle,
} from "../styles";

const DEFAULT_INPUTS = {
  vehiclePrice: "",
  businessUse: 80,
  paymentMethod: "finance",
  cashAmount: "",
  financeAmount: "",
  loanTerm: 5,
  interestRate: 7.5,
  annualIncome: "",
  annualExpenses: "",
  cashReserves: "",
  annualKm: 15000,
  vehicleType: "sedan",
  ownershipPeriod: 5,
  entityType: "individual",
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const VehicleAnalysis = ({ onBack }) => {
  const { state, setInputs, setResults, setCalculating, setIssues } = useDecision();

console.log("CTX functions:", {
  setInputs,
  setResults,
  setCalculating,
  setIssues,
});

// Tracks which split field user last edited ("cash" | "finance" | null)
  const lastSplitEditedRef = useRef(null);

  // Initialise global inputs once
  useEffect(() => {
    if (!state.inputs) setInputs(DEFAULT_INPUTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inputs]);

  const formData = state.inputs ?? DEFAULT_INPUTS;
  const result = state.results;
  const showResults = Boolean(state.results);

  const handleChange = (field) => (e) => {
    const { type, value } = e.target;
    const numericTypes = ["number", "range"];
    const parsed = numericTypes.includes(type) && value !== "" ? Number(value) : value;

    let next = {
      ...formData,
      [field]: parsed,
    };

    // Track which split side the user is controlling
    if (field === "cashAmount") lastSplitEditedRef.current = "cash";
    if (field === "financeAmount") lastSplitEditedRef.current = "finance";

   // Auto-calc split amounts
if (next.paymentMethod === "split") {
  const price = Number(next.vehiclePrice) || 0;

  if (field === "cashAmount") {
    // allow empty while typing
    if (next.cashAmount === "" || next.cashAmount === null || next.cashAmount === undefined) {
      next.financeAmount = "";
    } else {
      const cash = clamp(Number(next.cashAmount), 0, price);
      next.cashAmount = cash;
      next.financeAmount = clamp(price - cash, 0, price);
    }
  } else if (field === "financeAmount") {
    // allow empty while typing
    if (
      next.financeAmount === "" ||
      next.financeAmount === null ||
      next.financeAmount === undefined
    ) {
      next.cashAmount = "";
    } else {
      const fin = clamp(Number(next.financeAmount), 0, price);
      next.financeAmount = fin;
      next.cashAmount = clamp(price - fin, 0, price);
    }
  } else if (field === "vehiclePrice") {
    // price changed — preserve last edited side
    const last = lastSplitEditedRef.current;

    if (last === "cash") {
      const cash = clamp(Number(next.cashAmount) || 0, 0, price);
      next.cashAmount = cash;
      next.financeAmount = clamp(price - cash, 0, price);
    } else if (last === "finance") {
      const fin = clamp(Number(next.financeAmount) || 0, 0, price);
      next.financeAmount = fin;
      next.cashAmount = clamp(price - fin, 0, price);
    }
  }
}
    setInputs(next);
  };

  const handlePaymentMethodClick = (method) => {
    let next = { ...formData, paymentMethod: method };

    // When switching to split, initialise amounts nicely
    if (method === "split") {
      const price = Number(next.vehiclePrice) || 0;

      const hasCash = next.cashAmount !== "" && next.cashAmount !== null && next.cashAmount !== undefined;
      const hasFin =
        next.financeAmount !== "" && next.financeAmount !== null && next.financeAmount !== undefined;

      if (!hasCash && !hasFin) {
        const cash = clamp(Math.round(price * 0.2), 0, price);
        next.cashAmount = cash;
        next.financeAmount = clamp(price - cash, 0, price);
        lastSplitEditedRef.current = "cash";
      } else if (hasCash && !hasFin) {
        const cash = clamp(Number(next.cashAmount) || 0, 0, price);
        next.cashAmount = cash;
        next.financeAmount = clamp(price - cash, 0, price);
        lastSplitEditedRef.current = "cash";
      } else if (!hasCash && hasFin) {
        const fin = clamp(Number(next.financeAmount) || 0, 0, price);
        next.financeAmount = fin;
        next.cashAmount = clamp(price - fin, 0, price);
        lastSplitEditedRef.current = "finance";
      } else {
        // Both exist - keep them as-is, but set a default controller
        if (!lastSplitEditedRef.current) lastSplitEditedRef.current = "cash";
      }
    }

    setInputs(next);
  };

const handleCalculate = () => {
  console.log("ANALYZE CLICKED", formData);

  setCalculating(true);

  const computed = runVehicleEngine(formData);
  console.log("ENGINE OUTPUT", computed);

  setIssues(computed.issues || []);

    const ui = computed?.results?.ui ?? null;
  console.log("UI RESULTS", ui);

  setResults(ui);
};

  const handleBackToForm = () => {
    // Return to form view by clearing results (keep inputs intact)
    setResults(null);
  };

  // Determine which payment fields to show
  const showFinanceFields =
    formData.paymentMethod === "finance" || formData.paymentMethod === "split";
  const showCashField = formData.paymentMethod === "split";

  // If showing results, render results screen
  if (showResults && result) {
    return (
      <div style={outerShellStyle}>
        <div style={scrollContainerStyle}>
          <div style={enhancedCardStyle}>
            <button
              onClick={handleBackToForm}
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
              <span>Back to Form</span>
            </button>

            <div style={headerStyle}>
              <div style={iconCircleStyle}>
                <span style={{ fontSize: 28 }}>📊</span>
              </div>
              <h1 style={titleStyle}>Analysis Complete</h1>
              <p style={subtitleStyle}>Here's your comprehensive financial analysis</p>
            </div>

            <ResultsPanel result={result} formData={formData} />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render the form
  return (
    <div style={outerShellStyle}>
      <div style={scrollContainerStyle}>
        <div style={enhancedCardStyle}>
          <BackButton onClick={onBack} />

          <div style={headerStyle}>
            <div style={iconCircleStyle}>
              <span style={{ fontSize: 28 }}>🚗</span>
            </div>
            <h1 style={titleStyle}>Vehicle Purchase Analysis</h1>
            <p style={subtitleStyle}>
              Complete the details below for a comprehensive financial analysis of your vehicle
              purchase decision.
            </p>
          </div>

          {/* VEHICLE DETAILS SECTION */}
          <Section icon="🚐" title="Vehicle Details">
            <div style={fieldGroupStyle}>
              <LabeledInput
                label="Vehicle Price ($)"
                placeholder="e.g. 65,000"
                type="number"
                value={formData.vehiclePrice}
                onChange={handleChange("vehiclePrice")}
              />

              <SelectField
                label="Vehicle Type"
                value={formData.vehicleType}
                onChange={handleChange("vehicleType")}
                options={[
                  { value: "sedan", label: "Sedan" },
                  { value: "suv", label: "SUV" },
                  { value: "ute", label: "Ute" },
                  { value: "van", label: "Van" },
                  { value: "truck", label: "Truck" },
                  { value: "luxury", label: "Luxury Vehicle" },
                ]}
              />

              <div style={twoColStyle}>
                <LabeledInput
                  label="Annual KM"
                  placeholder="e.g. 15,000"
                  type="number"
                  value={formData.annualKm}
                  onChange={handleChange("annualKm")}
                />
                <LabeledInput
                  label="Ownership Period (years)"
                  placeholder="e.g. 5"
                  type="number"
                  value={formData.ownershipPeriod}
                  onChange={handleChange("ownershipPeriod")}
                />
              </div>

              <SliderField
                label="Business Use"
                value={formData.businessUse}
                onChange={handleChange("businessUse")}
                suffix="%"
              />
            </div>
          </Section>

          {/* PAYMENT METHOD SECTION */}
          <Section icon="💳" title="Payment Method">
            <div style={fieldGroupStyle}>
              <div style={fieldBlockStyle}>
                <label style={labelStyle}>How will you pay?</label>
                <div style={paymentButtonGroupStyle}>
                  {[
                    { value: "cash", label: "Cash", icon: "💵" },
                    { value: "finance", label: "Finance", icon: "🏦" },
                    { value: "split", label: "Split", icon: "📊" },
                  ].map((method) => {
                    const active = formData.paymentMethod === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => handlePaymentMethodClick(method.value)}
                        style={{
                          ...paymentButtonStyle,
                          ...(active ? activePaymentButtonStyle : {}),
                        }}
                      >
                        <span style={{ fontSize: 20, marginBottom: 4 }}>{method.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Fields Based on Payment Method */}
              {showCashField && (
                <div style={fadeInStyle}>
                  <LabeledInput
                    label="Cash Deposit Amount ($)"
                    placeholder="e.g. 20,000"
                    type="number"
                    value={formData.cashAmount}
                    onChange={handleChange("cashAmount")}
                  />
                </div>
              )}

              {showFinanceFields && (
                <div style={fadeInStyle}>
                  {formData.paymentMethod === "split" && (
                    <LabeledInput
                      label="Finance Amount ($)"
                      placeholder="Auto-calculates remaining balance"
                      type="number"
                      value={formData.financeAmount}
                      onChange={handleChange("financeAmount")}
                    />
                  )}
                  <div style={twoColStyle}>
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
              )}
            </div>
          </Section>

          {/* BUSINESS DETAILS SECTION */}
          <Section icon="💼" title="Business Details">
            <div style={fieldGroupStyle}>
              <SelectField
                label="Business Structure"
                value={formData.entityType}
                onChange={handleChange("entityType")}
                options={[
                  { value: "individual", label: "Sole Trader / Individual" },
                  { value: "company", label: "Company" },
                  { value: "trust", label: "Trust" },
                  { value: "partnership", label: "Partnership" },
                ]}
              />

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
          </Section>

          {/* ANALYZE BUTTON */}
          <div style={buttonContainerStyle}>
            <button onClick={handleCalculate} style={analyzeButtonStyle}>
              <span style={{ fontSize: 18, marginRight: 8 }}>🔍</span>
              Analyze Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== HELPER COMPONENTS ==========

const Section = ({ icon, title, children }) => (
  <div style={sectionContainerStyle}>
    <div style={sectionHeaderStyle}>
      <span style={{ fontSize: 20, marginRight: 8 }}>{icon}</span>
      <h2 style={sectionTitleStyleEnhanced}>{title}</h2>
    </div>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div style={fieldBlockStyle}>
    <label style={labelStyle}>{label}</label>
    <select value={value} onChange={onChange} style={selectStyle}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SliderField = ({ label, value, onChange, suffix }) => (
  <div style={fieldBlockStyle}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <label style={labelStyle}>{label}</label>
      <span style={sliderValueStyle}>
        {value}
        {suffix}
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={onChange}
      style={{
        ...sliderStyle,
        background: `linear-gradient(to right, ${PRIMARY} 0%, ${PRIMARY} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
      }}
    />
  </div>
);

// ========== ENHANCED STYLES ==========

const enhancedCardStyle = {
  ...cardStyle,
  background: "linear-gradient(to bottom, #ffffff, #fafafa)",
  boxShadow: "0 25px 60px rgba(15,23,42,0.12), 0 5px 15px rgba(15,23,42,0.08)",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: 28,
  paddingBottom: 20,
  borderBottom: "2px solid #f3f4f6",
};

const iconCircleStyle = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${PRIMARY}, #6366f1)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 12px",
  boxShadow: "0 10px 30px rgba(79,70,229,0.3)",
};

const titleStyle = {
  margin: "0 0 8px",
  fontSize: 26,
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
  lineHeight: 1.6,
  maxWidth: 480,
  marginLeft: "auto",
  marginRight: "auto",
};

const sectionContainerStyle = {
  marginBottom: 24,
  padding: 18,
  borderRadius: 16,
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: "1px solid #f3f4f6",
};

const sectionTitleStyleEnhanced = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: "#1e293b",
};

const paymentButtonGroupStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
  marginTop: 8,
};

const paymentButtonStyle = {
  padding: "16px 12px",
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  color: "#64748b",
};

const activePaymentButtonStyle = {
  border: `2px solid ${PRIMARY}`,
  backgroundColor: PRIMARY_LIGHT,
  color: PRIMARY,
  transform: "translateY(-2px)",
  boxShadow: "0 8px 20px rgba(79,70,229,0.2)",
};

const twoColStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 35,
};

const sliderStyle = {
  width: "100%",
  height: 6,
  borderRadius: 5,
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

const sliderValueStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: PRIMARY,
  backgroundColor: PRIMARY_LIGHT,
  padding: "4px 12px",
  borderRadius: 20,
};

const buttonContainerStyle = {
  marginTop: 28,
  display: "flex",
  justifyContent: "center",
};

const analyzeButtonStyle = {
  ...primaryButtonStyle,
  fontSize: 16,
  padding: "14px 32px",
  boxShadow: "0 15px 35px rgba(79,70,229,0.35)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
};

const fadeInStyle = {
  animation: "fadeIn 0.3s ease-in",
};

export default VehicleAnalysis;
