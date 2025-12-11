import React from "react";
import { PRIMARY } from "../styles";

const BackButton = ({ onClick }) => {
  return (
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
};

export default BackButton;