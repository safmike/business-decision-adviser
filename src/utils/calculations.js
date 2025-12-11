/**
 * Business logic and calculations for vehicle purchase analysis
 */

export const calculateResults = (formData) => {
  const price = Number(formData.vehiclePrice) || 0;
  const income = Number(formData.annualIncome) || 0;
  const expenses = Number(formData.annualExpenses) || 0;
  const reserves = Number(formData.cashReserves) || 0;
  const businessUse = Number(formData.businessUse) || 0;

  const netIncome = income - expenses;
  const priceToNetIncome = netIncome > 0 ? price / netIncome : null;

  // Calculate scores (placeholder logic - will be enhanced later)
  const taxEfficiencyScore = calculateTaxScore(businessUse);
  const cashFlowScore = calculateCashFlowScore(price, netIncome, reserves);
  const safetyScore = calculateSafetyScore(price, reserves, netIncome);

  const overallScore = Math.round(
    (taxEfficiencyScore + cashFlowScore + safetyScore) / 3
  );

  const verdict = generateVerdict(overallScore);
  const commentary = generateCommentary(businessUse, netIncome, reserves, price);

  return {
    netIncome: Math.round(netIncome),
    priceToNetIncome:
      priceToNetIncome !== null ? priceToNetIncome.toFixed(1) : "n/a",
    overallScore,
    taxEfficiencyScore,
    cashFlowScore,
    safetyScore,
    verdict,
    commentary,
  };
};

const calculateTaxScore = (businessUse) => {
  return Math.round(Math.max(0, Math.min(100, businessUse + 20)));
};

const calculateCashFlowScore = (price, netIncome, reserves) => {
  if (price === 0 || netIncome <= 0) return 10;

  let baseScore = Math.max(
    0,
    Math.min(100, (netIncome / price) * 14 * (80 / 100))
  );

  if (reserves > price * 0.2) {
    baseScore += 10;
  }

  return Math.round(Math.max(0, Math.min(100, baseScore)));
};

const calculateSafetyScore = (price, reserves, netIncome) => {
  const reserveRatio = (reserves / (price * 0.3 || 1)) * 60;
  const incomeBonus = netIncome > 0 ? 20 : 0;
  return Math.round(Math.max(0, Math.min(100, reserveRatio + incomeBonus)));
};

const generateVerdict = (score) => {
  if (score >= 75) {
    return "Green – on these numbers, this looks broadly comfortable, subject to detailed advice.";
  } else if (score >= 45) {
    return "Amber – this could be workable, but it warrants a closer look at cash flow and risk.";
  } else {
    return "Red – on these inputs, this decision looks financially tight and may not be sensible.";
  }
};

const generateCommentary = (businessUse, netIncome, reserves, price) => {
  return {
    tax:
      businessUse >= 50
        ? "At this business-use level, a large portion of running costs should be deductible."
        : "With lower business-use, tax benefits will be more limited.",
    cash:
      netIncome > 0
        ? "Positive net income suggests the vehicle could be supported by current cash flow."
        : "Negative or low net income suggests cash flow pressure.",
    reserves:
      reserves >= price * 0.2
        ? "Reserves look reasonable relative to the vehicle cost."
        : "Reserves look light – there may be limited cushion for shocks.",
  };
};