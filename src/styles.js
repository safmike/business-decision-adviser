// Design tokens and shared styles
export const PRIMARY = "#4f46e5";
export const PRIMARY_LIGHT = "#eef2ff";
export const CARD_RADIUS = 20;

export const outerShellStyle = {
  minHeight: "100vh",
  margin: 0,
  padding: 16,
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(16,185,129,0.08))",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

export const centerContainerStyle = {
  width: "100%",
  maxWidth: 420,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const scrollContainerStyle = {
  width: "100%",
  maxWidth: 520,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

export const cardStyle = {
  width: "100%",
  backgroundColor: "white",
  borderRadius: CARD_RADIUS,
  padding: 22,
  boxShadow: "0 20px 50px rgba(15,23,42,0.16), 0 1px 3px rgba(15,23,42,0.12)",
};

export const primaryButtonStyle = {
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

export const sectionTitleStyle = {
  margin: "10px 0 6px",
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
};

export const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

export const fieldBlockStyle = {
  display: "flex",
  flexDirection: "column",
};

export const labelStyle = {
  fontSize: 12,
  color: "#4b5563",
  marginBottom: 4,
};

export const inputStyle = {
  padding: "8px 10px",
  fontSize: 13,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export const segmentedControlRowStyle = {
  display: "flex",
  gap: 6,
  marginTop: 2,
  backgroundColor: "#f9fafb",
  padding: 3,
  borderRadius: 999,
};

export const twoColRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 10,
};

export const resultsCardStyle = {
  marginTop: 6,
  borderRadius: 14,
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  padding: 12,
};

// Add fadeIn animation to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}