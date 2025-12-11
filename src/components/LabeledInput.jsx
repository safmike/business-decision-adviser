import React from "react";
import { fieldBlockStyle, labelStyle, inputStyle } from "../styles";

const LabeledInput = ({ label, placeholder, type, value, onChange }) => {
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
};

export default LabeledInput;