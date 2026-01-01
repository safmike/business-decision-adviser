import React from "react";
import { fieldBlockStyle, labelStyle, inputStyle } from "../styles";

const LabeledInput = ({ label, placeholder, type, value, onChange }) => {
  const handleChange = (e) => {
    if (type === "number") {
      const inputValue = e.target.value;
      
      // Allow empty string (so users can clear the field)
      if (inputValue === "") {
        onChange(e);
        return;
      }
      
      // Convert to number and check if it's negative
      const numValue = Number(inputValue);
      
      // Block negative numbers
      if (numValue < 0) {
        return; // Don't update if negative
      }
    }
    
    // For non-number inputs or valid numbers, proceed normally
    onChange(e);
  };

  return (
    <div style={fieldBlockStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
};

export default LabeledInput;