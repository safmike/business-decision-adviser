/**
 * Enhanced Business Logic for Vehicle Purchase Analysis
 * Includes: LCT, FBT, Instant Write-Off, Depreciation, Running Costs
 */

// ========== CONSTANTS ==========

const LCT_THRESHOLD_STANDARD = 91387; // 2024-25 luxury car tax threshold
const LCT_THRESHOLD_FUEL_EFFICIENT = 84916; // For fuel-efficient vehicles
const LCT_RATE = 0.33; // 33% tax on amount above threshold

const INSTANT_WRITEOFF_THRESHOLD = 20000; // Under $20k = instant write-off eligible

const FBT_RATE = 0.47; // 47% FBT rate (2024-25)
const FBT_STATUTORY_RATE = 0.20; // 20% statutory method

// Tax brackets (2024-25)
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18200, max: 45000, rate: 0.19 },
  { min: 45000, max: 120000, rate: 0.325 },
  { min: 120000, max: 180000, rate: 0.37 },
  { min: 180000, max: Infinity, rate: 0.45 }
];

// Company tax rate
const COMPANY_TAX_RATE = 0.25; // 25% for base rate entities (turnover < $50m)

// Vehicle depreciation rates (diminishing value method)
const DEPRECIATION_RATES = {
  sedan: 0.25,
  suv: 0.25,
  ute: 0.20,
  van: 0.20,
  truck: 0.15,
  luxury: 0.25
};

// Running costs per km (rough estimates in cents)
const RUNNING_COSTS_PER_KM = {
  sedan: 0.65,
  suv: 0.85,
  ute: 0.75,
  van: 0.80,
  truck: 1.20,
  luxury: 1.50
};

// ========== MAIN CALCULATION FUNCTION ==========

export const calculateResults = (formData) => {
  // Parse inputs
  const price = Number(formData.vehiclePrice) || 0;
  const income = Number(formData.annualIncome) || 0;
  const expenses = Number(formData.annualExpenses) || 0;
  const reserves = Number(formData.cashReserves) || 0;
  const businessUsePct = Number(formData.businessUse) || 0;
  const businessUse = businessUsePct / 100;
  const annualKm = Number(formData.annualKm) || 15000;
  const vehicleType = formData.vehicleType || "sedan";
  const ownershipYears = Number(formData.ownershipPeriod) || 5;
  const entityType = formData.entityType || "individual";
  const paymentMethod = formData.paymentMethod || "finance";
  const loanTerm = Number(formData.loanTerm) || 5;
  const interestRate = (Number(formData.interestRate) || 7.5) / 100;

  // Calculate finance details
  const { monthlyPayment, totalInterest, financePortion, cashPortion } = 
    calculateFinanceDetails(price, paymentMethod, loanTerm, interestRate);

  // Calculate LCT
  const lctDetails = calculateLCT(price, vehicleType);

  // Calculate tax position
  const taxableIncome = Math.max(0, income - expenses);
  const taxRate = calculateTaxRate(taxableIncome, entityType);

  // Calculate depreciation vs instant write-off
  const depreciationAnalysis = calculateDepreciation(
    price, 
    vehicleType, 
    businessUse, 
    ownershipYears,
    taxRate
  );

  // Calculate running costs
  const runningCosts = calculateRunningCosts(
    vehicleType, 
    annualKm, 
    businessUse, 
    ownershipYears
  );

  // Calculate FBT implications
  const fbtWarnings = calculateFBT(price, businessUsePct, entityType);

  // Total cost of ownership
  const totalCostOfOwnership = calculateTotalCost(
    price,
    totalInterest,
    runningCosts.totalOverOwnership,
    depreciationAnalysis.totalTaxSavings
  );

  // Cash flow analysis
  const cashFlowAnalysis = analyzeCashFlow(
    income,
    expenses,
    reserves,
    monthlyPayment,
    runningCosts.monthlyRunningCost,
    cashPortion
  );

  // Generate risk flags
  const riskFlags = generateRiskFlags(
    cashFlowAnalysis,
    lctDetails,
    fbtWarnings,
    businessUsePct,
    annualKm,
    price,
    income
  );

  // Generate positive flags
  const positiveFlags = generatePositiveFlags(
    cashFlowAnalysis,
    depreciationAnalysis,
    businessUsePct,
    price,
    reserves
  );

  // Generate opportunity flags
  const opportunityFlags = generateOpportunityFlags(
    price,
    totalCostOfOwnership,
    depreciationAnalysis,
    businessUsePct,
    cashFlowAnalysis,
    financePortion,
    totalInterest
  );

  // Calculate scores
  const scores = calculateScores(
    depreciationAnalysis,
    cashFlowAnalysis,
    businessUsePct,
    taxRate,
    riskFlags
  );

  // Generate summary
  const summary = generateSummary(scores.overall, riskFlags);

  return {
    ...scores,
    monthlyPayment: monthlyPayment.toFixed(0),
    totalInterest: totalInterest.toFixed(0),
    cashAfterPurchase: cashFlowAnalysis.cashAfterPurchase.toFixed(0),
    monthsOfReserves: cashFlowAnalysis.monthsOfReserves.toFixed(1),
    totalCostOfOwnership: totalCostOfOwnership.netCost.toFixed(0),
    lctAmount: lctDetails.lctAmount.toFixed(0),
    hasLCT: lctDetails.hasLCT,
    instantWriteOffEligible: depreciationAnalysis.instantWriteOffEligible,
    taxSavingsYear1: depreciationAnalysis.taxSavingsYear1.toFixed(0),
    totalTaxSavings: depreciationAnalysis.totalTaxSavings.toFixed(0),
    monthlyRunningCost: runningCosts.monthlyRunningCost.toFixed(0),
    totalRunningCosts: runningCosts.totalOverOwnership.toFixed(0),
    riskFlags,
    positiveFlags,
    opportunityFlags,
    summary,
    fbtWarnings
  };
};

// ========== HELPER FUNCTIONS ==========

const calculateFinanceDetails = (price, method, term, rate) => {
  let cashPortion = 0;
  let financePortion = 0;

  if (method === "cash") {
    cashPortion = price;
  } else if (method === "finance") {
    financePortion = price;
  } else {
    // Split - default 20% cash, 80% finance
    cashPortion = price * 0.2;
    financePortion = price * 0.8;
  }

  let monthlyPayment = 0;
  let totalInterest = 0;

  if (financePortion > 0 && rate > 0 && term > 0) {
    const monthlyRate = rate / 12;
    const numPayments = term * 12;
    const pow = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = financePortion * (monthlyRate * pow) / (pow - 1);
    totalInterest = monthlyPayment * numPayments - financePortion;
  } else if (financePortion > 0 && term > 0) {
    monthlyPayment = financePortion / (term * 12);
  }

  return { monthlyPayment, totalInterest, financePortion, cashPortion };
};

const calculateLCT = (price, vehicleType) => {
  const threshold = vehicleType === "luxury" || price > LCT_THRESHOLD_STANDARD
    ? LCT_THRESHOLD_STANDARD
    : LCT_THRESHOLD_FUEL_EFFICIENT;

  const hasLCT = price > threshold;
  const lctAmount = hasLCT ? (price - threshold) * LCT_RATE : 0;

  return { hasLCT, lctAmount, threshold };
};

const calculateTaxRate = (taxableIncome, entityType) => {
  if (entityType === "company") {
    return COMPANY_TAX_RATE;
  }

  for (let bracket of TAX_BRACKETS) {
    if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
      return bracket.rate;
    }
  }
  return 0.45; // Top rate
};

const calculateDepreciation = (price, vehicleType, businessUse, years, taxRate) => {
  const businessPortion = price * businessUse;
  const instantWriteOffEligible = businessPortion > 0 && businessPortion <= INSTANT_WRITEOFF_THRESHOLD;

  let taxSavingsYear1 = 0;
  let totalTaxSavings = 0;

  if (instantWriteOffEligible) {
    // Full deduction in year 1
    taxSavingsYear1 = businessPortion * taxRate;
    totalTaxSavings = taxSavingsYear1;
  } else {
    // Depreciation over time (diminishing value)
    const depRate = DEPRECIATION_RATES[vehicleType] || 0.25;
    let remainingValue = businessPortion;

    for (let year = 1; year <= years; year++) {
      const depreciation = remainingValue * depRate;
      const taxSaving = depreciation * taxRate;
      totalTaxSavings += taxSaving;
      
      if (year === 1) {
        taxSavingsYear1 = taxSaving;
      }
      
      remainingValue -= depreciation;
    }
  }

  return {
    instantWriteOffEligible,
    taxSavingsYear1,
    totalTaxSavings,
    method: instantWriteOffEligible ? "Instant Write-Off" : "Depreciation"
  };
};

const calculateRunningCosts = (vehicleType, annualKm, businessUse, years) => {
  const costPerKm = RUNNING_COSTS_PER_KM[vehicleType] || 0.70;
  const annualCost = annualKm * costPerKm;
  const businessCost = annualCost * businessUse;
  const totalOverOwnership = businessCost * years;
  const monthlyRunningCost = businessCost / 12;

  return {
    annualRunningCost: businessCost,
    monthlyRunningCost,
    totalOverOwnership
  };
};

const calculateFBT = (price, businessUsePct, entityType) => {
  const warnings = [];

  if (businessUsePct < 100 && entityType !== "individual") {
    const privateUse = 100 - businessUsePct;
    const fbtLiability = price * FBT_STATUTORY_RATE * FBT_RATE * (privateUse / 100);
    
    warnings.push({
      severity: "warning",
      message: `${privateUse}% private use may trigger ~$${Math.round(fbtLiability).toLocaleString()} annual FBT liability.`
    });
  }

  return warnings;
};

const calculateTotalCost = (price, interest, runningCosts, taxSavings) => {
  const totalOutlay = price + interest + runningCosts;
  const netCost = totalOutlay - taxSavings;

  return { totalOutlay, netCost, taxSavings };
};

const analyzeCashFlow = (income, expenses, reserves, loanPayment, runningCost, cashPortion) => {
  const monthlyIncome = income / 12;
  const monthlyExpenses = expenses / 12;
  const totalMonthlyCommitment = loanPayment + runningCost;
  const cashAfterPurchase = reserves - cashPortion;
  
  const monthsOfReserves = monthlyExpenses > 0 
    ? cashAfterPurchase / monthlyExpenses 
    : (cashAfterPurchase > 0 ? 99 : 0);
  
  const paymentToIncomeRatio = monthlyIncome > 0 
    ? totalMonthlyCommitment / monthlyIncome 
    : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    totalMonthlyCommitment,
    cashAfterPurchase,
    monthsOfReserves,
    paymentToIncomeRatio
  };
};

const generateRiskFlags = (cashFlow, lct, fbt, businessUsePct, annualKm, price, income) => {
  const flags = [];

  // Critical cash flow risks
  if (cashFlow.monthsOfReserves < 1) {
    flags.push({ 
      severity: "critical", 
      message: "Less than 1 month expenses in reserves after purchase - very risky." 
    });
  } else if (cashFlow.monthsOfReserves < 3) {
    flags.push({ 
      severity: "warning", 
      message: "Less than 3 months expenses in reserves - limited buffer." 
    });
  }

  if (cashFlow.paymentToIncomeRatio > 0.25) {
    flags.push({ 
      severity: "critical", 
      message: "Total vehicle costs exceed 25% of monthly income - serious strain." 
    });
  } else if (cashFlow.paymentToIncomeRatio > 0.15) {
    flags.push({ 
      severity: "warning", 
      message: "Vehicle costs exceed 15% of income - above recommended level." 
    });
  }

  // LCT warning
  if (lct.hasLCT) {
    flags.push({ 
      severity: "warning", 
      message: `Luxury car tax of $${Math.round(lct.lctAmount).toLocaleString()} applies - adds to total cost.` 
    });
  }

  // Business use validation
  const businessKm = annualKm * (businessUsePct / 100);
  if (businessUsePct > 80 && businessKm < 10000) {
    flags.push({ 
      severity: "warning", 
      message: `Claiming ${businessUsePct}% business use but only ${businessKm.toLocaleString()}km - may face ATO scrutiny.` 
    });
  }

  // Price relative to income
  if (income > 0 && price / income > 0.7) {
    flags.push({ 
      severity: "advisory", 
      message: "Vehicle price exceeds 70% of annual income - consider if appropriate." 
    });
  }

  // FBT warnings
  flags.push(...fbt);

  return flags;
};

const generatePositiveFlags = (cashFlow, depreciation, businessUsePct, price, reserves) => {
  const flags = [];

  if (cashFlow.monthsOfReserves > 6 && cashFlow.paymentToIncomeRatio < 0.10) {
    flags.push({ 
      message: "Strong financial position - healthy reserves with manageable commitments." 
    });
  }

  if (depreciation.instantWriteOffEligible && businessUsePct >= 80) {
    flags.push({ 
      message: "Excellent tax position - instant write-off with high business use maximizes benefits." 
    });
  }

  if (price < reserves * 0.5) {
    flags.push({ 
      message: "Conservative purchase - vehicle cost is less than half your reserves." 
    });
  }

  return flags;
};

const generateOpportunityFlags = (price, totalCost, depreciation, businessUsePct, cashFlow, financePortion, totalInterest) => {
  const flags = [];

  // Alternative vehicle price suggestion
  if (cashFlow.paymentToIncomeRatio > 0.15) {
    const betterPrice = Math.round(price * 0.70);
    flags.push({ 
      message: `A $${betterPrice.toLocaleString()} vehicle would significantly improve cash flow and reduce financial strain.` 
    });
  }

  // Increase business use
  if (businessUsePct < 80 && businessUsePct > 50 && depreciation.instantWriteOffEligible) {
    flags.push({ 
      message: `Increasing business use to 80% could provide additional tax benefits while staying under instant write-off threshold.` 
    });
  }

  // Reduce financing
  if (financePortion > 0 && cashFlow.monthsOfReserves > 6 && totalInterest > 5000) {
    const savings = Math.round(totalInterest * 0.3);
    flags.push({ 
      message: `With strong reserves, increasing cash deposit could save ~$${savings.toLocaleString()} in interest.` 
    });
  }

  return flags;
};

const calculateScores = (depreciation, cashFlow, businessUsePct, taxRate, riskFlags) => {
  // Tax efficiency score
  let taxScore = depreciation.instantWriteOffEligible ? 95 : 75;
  if (businessUsePct < 50) taxScore -= 15;
  if (taxRate === 0) taxScore -= 10;
  taxScore = Math.max(0, Math.min(100, taxScore));

  // Cash flow score
  let cashFlowScore = 100;
  if (cashFlow.paymentToIncomeRatio > 0.25) cashFlowScore = 30;
  else if (cashFlow.paymentToIncomeRatio > 0.15) cashFlowScore = 55;
  else if (cashFlow.paymentToIncomeRatio > 0.10) cashFlowScore = 75;
  else if (cashFlow.paymentToIncomeRatio > 0.05) cashFlowScore = 88;

  // Safety score
  let safetyScore = cashFlow.monthsOfReserves < 1 ? 25 
    : cashFlow.monthsOfReserves < 3 ? 55 
    : cashFlow.monthsOfReserves < 6 ? 80 
    : 100;

  // Overall score with risk penalties
  let overall = taxScore * 0.35 + cashFlowScore * 0.35 + safetyScore * 0.30;
  
  const criticalCount = riskFlags.filter(r => r.severity === 'critical').length;
  const warningCount = riskFlags.filter(r => r.severity === 'warning').length;
  const advisoryCount = riskFlags.filter(r => r.severity === 'advisory').length;
  
  overall -= (criticalCount * 7 + warningCount * 4 + advisoryCount * 2);
  overall = Math.round(Math.max(0, Math.min(100, overall)));

  return {
    overall,
    taxScore: Math.round(taxScore),
    cashFlowScore: Math.round(cashFlowScore),
    safetyScore: Math.round(safetyScore)
  };
};

const generateSummary = (score, riskFlags) => {
  const criticalRisks = riskFlags.filter(r => r.severity === 'critical');
  
  if (score >= 80) {
    return "This looks like a sensible purchase based on the numbers.";
  } else if (score >= 60) {
    return "This could work but be mindful of the risks highlighted below.";
  } else if (criticalRisks.length > 0) {
    return "This purchase looks quite risky - see critical concerns below.";
  } else {
    return "This purchase looks aggressive - consider adjusting price or timing.";
  }
};