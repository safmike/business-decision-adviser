import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DecisionProvider } from "./contexts/DecisionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DecisionProvider>
      <App />
    </DecisionProvider>
  </StrictMode>
);
