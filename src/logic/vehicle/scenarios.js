// src/logic/vehicle/scenarios.js
import { runVehicleEngine } from "./engine.js";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function toNumberOrNull(x) {
  if (x === "" || x === null || x === undefined) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * If paymentMethod is split:
 * - Prefer cashAmount if present -> finance = price - cash
 * - Else if finance present -> cash = price - finance
 * - Else default 20% deposit
 */
function normalizeSplit(inputs) {
  if (inputs.paymentMethod !== "split") return inputs;

  const price = toNumberOrNull(inputs.vehiclePrice);
  if (price === null || price <= 0) return inputs;

  const cash = toNumberOrNull(inputs.cashAmount);
  const fin = toNumberOrNull(inputs.financeAmount);

  if (cash !== null) {
    const c = clamp(Math.round(cash), 0, price);
    return { ...inputs, cashAmount: c, financeAmount: clamp(price - c, 0, price) };
  }

  if (fin !== null) {
    const f = clamp(Math.round(fin), 0, price);
    return { ...inputs, financeAmount: f, cashAmount: clamp(price - f, 0, price) };
  }

  const c = clamp(Math.round(price * 0.2), 0, price);
  return { ...inputs, cashAmount: c, financeAmount: clamp(price - c, 0, price) };
}

/**
 * IMPORTANT: when price changes, we MUST rebalance split amounts.
 * This function forces financeAmount = newPrice - cashAmount (if split).
 */
function withVehiclePrice(base, newPrice) {
  const nextPrice = Math.max(0, Math.round(newPrice));
  const next = { ...base, vehiclePrice: nextPrice };

  if (next.paymentMethod !== "split") return next;

  // Force split coherency using the user's cash deposit if set
  const cash = toNumberOrNull(next.cashAmount);
  if (cash !== null) {
    const c = clamp(Math.round(cash), 0, nextPrice);
    return { ...next, cashAmount: c, financeAmount: clamp(nextPrice - c, 0, nextPrice) };
  }

  // Otherwise fall back to normalizer (finance present or default)
  return normalizeSplit(next);
}

function withInterestRate(base, deltaPct) {
  const current = toNumberOrNull(base.interestRate) ?? 0;
  return normalizeSplit({ ...base, interestRate: current + deltaPct });
}

function withBusinessUse(base, pct) {
  return normalizeSplit({ ...base, businessUse: clamp(Math.round(pct), 0, 100) });
}

/**
 * Output: [{ id, name, inputs, issues, results, ui }]
 * NOW DYNAMIC: scenarios adjust based on actual inputs
 */
export function generateVehicleScenarios(baseInputs) {
  const raw = clone(baseInputs);
  const price = toNumberOrNull(raw.vehiclePrice);

  // If no valid price, return only current to avoid nonsense scenarios
  if (price === null || price <= 0) {
    const computed = runVehicleEngine(raw);
    return [
      {
        id: "current",
        name: "Current",
        inputs: raw,
        issues: computed.issues,
        results: computed.results,
        ui: computed?.results?.ui ?? null,
      },
    ];
  }

  const base = normalizeSplit(raw);

  const scenarioInputs = [
    { id: "current", name: "Current", inputs: base },

    // DYNAMIC price scenarios (relative to current price)
    { 
      id: "price_20pct", 
      name: "20% Cheaper", 
      inputs: withVehiclePrice(base, price * 0.80) 
    },
    
    // STRESS TEST: what if interest rates rise?
    { 
      id: "rate_stress", 
      name: "Interest +2%", 
      inputs: withInterestRate(base, 2) 
    },
    
    // OPTIMIZATION: maximize tax benefits
    { 
      id: "business_max", 
      name: "Max Business Use", 
      inputs: withBusinessUse(base, 100) 
    },
  ];

  return scenarioInputs.map((s) => {
    const computed = runVehicleEngine(s.inputs);
    return {
      id: s.id,
      name: s.name,
      inputs: s.inputs,
      issues: computed.issues,
      results: computed.results,
      ui: computed?.results?.ui ?? null,
    };
  });
}