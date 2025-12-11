import React, { useState } from "react";
import BackButton from "../components/BackButton.jsx";
import LabeledInput from "../components/LabeledInput.jsx";
import ResultsPanel from "../components/ResultsPanel.jsx";
import { calculateResults } from "../utils/calculations";
import {
  outerShellStyle,
  scrollContainerStyle,
  cardStyle,
  sectionTitleStyle,
  fieldGroupStyle,
  fieldBlockStyle,
  labelStyle,
  segmentedControlRowStyle,
  twoColRowStyle,
  primaryButtonStyle,
  PRIMARY,
  PRIMARY_LIGHT,
  inputStyle,
} from "../styles";

const VehicleAnalysis = ({ onBack }) => {
  const [formData, setFormData] = useState({
    vehiclePrice: "",
    businessUse: 80,
    paymentMethod: "finance",
    loanTerm: 5,
    interestRate: 7.5,
    annualIncome: "",
    annualExpenses: "",
    cashReserves: "",
    // NEW FIELDS
    annualKm: 15000,
    vehicleType: "sedan",
    ownershipPeriod: 5,
    entityType: "individual",
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

  const handleCalculate = () => {
    const results = calculateResults(formData);
    setResult(results);
  };

  return (
    <div style={outerShellStyle}>
      <div style={scrollContainerStyle}>
        <div style={cardStyle}>
          <BackButton onClick={onBack} />

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
            Tell us about the vehicle and your business. We'll run a
            comprehensive financial analysis.
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

            {/* Vehicle Type Dropdown */}
            <div style={fieldBlockStyle}>
              <label style={labelStyle}>Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={handleChange("vehicleType")}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                }}
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="ute">Ute</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
                <option value="luxury">Luxury Vehicle</option>
              </select>
            </div>

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

            <LabeledInput
              label="Expected Annual KM"
              placeholder="e.g. 15,000"
              type="number"
              value={formData.annualKm}
              onChange={handleChange("annualKm")}
            />

            <LabeledInput
              label="Expected Ownership Period (years)"
              placeholder="e.g. 5"
              type="number"
              value={formData.ownershipPeriod}
              onChange={handleChange("ownershipPeriod")}
            />

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
          <h2 style={{ ...sectionTitleStyle, marginTop: 22 }}>
            Your Business
          </h2>

          <div style={fieldGroupStyle}>
            {/* Entity Type Dropdown */}
            <div style={fieldBlockStyle}>
              <label style={labelStyle}>Business Structure</label>
              <select
                value={formData.entityType}
                onChange={handleChange("entityType")}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                }}
              >
                <option value="individual">Sole Trader / Individual</option>
                <option value="company">Company</option>
                <option value="trust">Trust</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>

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
            <button onClick={handleCalculate} style={primaryButtonStyle}>
              Analyze Decision
            </button>
          </div>

          {/* RESULTS */}
          <ResultsPanel result={result} formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default VehicleAnalysis;