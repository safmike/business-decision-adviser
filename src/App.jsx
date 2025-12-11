import React, { useState } from "react";
import LandingScreen from "./screens/LandingScreen";
import DecisionTypeScreen from "./screens/DecisionTypeScreen";
import VehicleAnalysis from "./screens/VehicleAnalysis.jsx";

function App() {
  const [screen, setScreen] = useState("landing");

  if (screen === "landing") {
    return <LandingScreen onNext={() => setScreen("decisionType")} />;
  }
  
  if (screen === "decisionType") {
    return (
      <DecisionTypeScreen
        onBack={() => setScreen("landing")}
        onSelectVehicle={() => setScreen("vehicleAnalysis")}
      />
    );
  }
  
  return (
    <VehicleAnalysis onBack={() => setScreen("decisionType")} />
  );
}

export default App;