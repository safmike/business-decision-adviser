import React, { useState } from "react";
import { metricInfo } from "./metricInfo";

const MetricTile = ({ label, value }) => {
  const [openInfo, setOpenInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const infoKey = React.useMemo(() => {
    const normalized = String(label || "").toLowerCase().trim();
    if (normalized.includes("tax")) return "taxEfficiency";
    if (normalized.includes("cash")) return "cashFlow";
    if (normalized.includes("safety")) return "financialSafety";
    return null;
  }, [label]);

  const info = infoKey ? metricInfo[infoKey] : null;

  return (
    <>
      <div
        onClick={() => info && setOpenInfo(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: 14,
          backgroundColor: isHovered ? "#f3f4f6" : "#f9fafb",
          border: isHovered ? "2px solid #9ca3af" : "1px solid #e5e7eb",
          padding: 10,
          position: "relative",
          cursor: info ? "pointer" : "default",
          transform: isHovered && info ? "scale(1.02)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
        role={info ? "button" : undefined}
        aria-label={info ? `Learn more about ${label}` : undefined}
        tabIndex={info ? 0 : undefined}
        onKeyDown={(e) => {
          if (info && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpenInfo(true);
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#6b7280",
            marginBottom: 4,
          }}
        >
          <span>{label}</span>
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

      {/* Modal */}
      {openInfo && info && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
          onClick={() => setOpenInfo(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              width: "100%",
              maxWidth: 440,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "#111827" }}>{label}</h3>
              <button
                onClick={() => setOpenInfo(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#6b7280",
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {info.long.map((section, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                    {section.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4, lineHeight: 1.45 }}>
                    {section.text}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpenInfo(false)}
              style={{
                marginTop: 6,
                width: "100%",
                border: "none",
                background: "#111827",
                color: "#fff",
                padding: "10px 12px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MetricTile;