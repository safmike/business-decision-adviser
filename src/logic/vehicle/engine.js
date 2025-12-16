/**
 * src/logic/vehicle/engine.js
 * Vehicle decision engine (pure). Ports current calculations.js logic
 * and returns structured results + legacy UI adapter.
 */

/** @typedef {import('../../types/vehicleTypes').VehicleInputs} VehicleInputs */
/** @typedef {import('../../types/vehicleTypes').VehicleResults} VehicleResults */
/** @typedef {import('../../types/vehicleTypes').ValidationIssue} ValidationIssue */

import { validateVehicleInputs } from './validators.js'

// ========== CONSTANTS (ported) ==========
const LCT_THRESHOLD_STANDARD = 91387
const LCT_THRESHOLD_FUEL_EFFICIENT = 84916
const LCT_RATE = 0.33

const INSTANT_WRITEOFF_THRESHOLD = 20000

const FBT_RATE = 0.47
const FBT_STATUTORY_RATE = 0.20

const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0 },
  { min: 18200, max: 45000, rate: 0.19 },
  { min: 45000, max: 120000, rate: 0.325 },
  { min: 120000, max: 180000, rate: 0.37 },
  { min: 180000, max: Infinity, rate: 0.45 }
]

const COMPANY_TAX_RATE = 0.25

const DEPRECIATION_RATES = {
  sedan: 0.25,
  suv: 0.25,
  ute: 0.20,
  van: 0.20,
  truck: 0.15,
  luxury: 0.25
}

const RUNNING_COSTS_PER_KM = {
  sedan: 0.65,
  suv: 0.85,
  ute: 0.75,
  van: 0.80,
  truck: 1.20,
  luxury: 1.50
}

// ========== small helpers ==========
function toNumber(x, fallback = 0) {
  const n = typeof x === 'string' && x.trim() === '' ? NaN : Number(x)
  return Number.isFinite(n) ? n : fallback
}

function round0(n) {
  return Math.round(n)
}

function round1(n) {
  return Math.round(n * 10) / 10
}

// ========== PORTED HELPERS (with one key fix: split uses entered amounts) ==========
function calculateFinanceDetails(price, method, termYears, annualRate, cashAmount, financeAmount) {
  let cashPortion = 0
  let financePortion = 0

  if (method === 'cash') {
    cashPortion = price
  } else if (method === 'finance') {
    financePortion = price
  } else {
    // split
    const cash = Number.isFinite(cashAmount) && cashAmount > 0 ? cashAmount : price * 0.2
    const fin = Number.isFinite(financeAmount) && financeAmount > 0 ? financeAmount : (price - cash)

    cashPortion = Math.max(0, cash)
    financePortion = Math.max(0, fin)
  }

  let monthlyPayment = 0
  let totalInterest = 0

  if (financePortion > 0 && annualRate > 0 && termYears > 0) {
    const monthlyRate = annualRate / 12
    const n = termYears * 12
    const pow = Math.pow(1 + monthlyRate, n)
    monthlyPayment = financePortion * (monthlyRate * pow) / (pow - 1)
    totalInterest = monthlyPayment * n - financePortion
  } else if (financePortion > 0 && termYears > 0) {
    monthlyPayment = financePortion / (termYears * 12)
  }

  return { monthlyPayment, totalInterest, financePortion, cashPortion }
}

function calculateLCT(price, vehicleType) {
  const threshold =
    vehicleType === 'luxury' || price > LCT_THRESHOLD_STANDARD
      ? LCT_THRESHOLD_STANDARD
      : LCT_THRESHOLD_FUEL_EFFICIENT

  const hasLCT = price > threshold
  const lctAmount = hasLCT ? (price - threshold) * LCT_RATE : 0
  return { hasLCT, lctAmount, threshold }
}

function calculateTaxRate(taxableIncome, entityType) {
  if (entityType === 'company') return COMPANY_TAX_RATE
  for (const b of TAX_BRACKETS) {
    if (taxableIncome >= b.min && taxableIncome < b.max) return b.rate
  }
  return 0.45
}

function calculateDepreciation(price, vehicleType, businessUse, years, taxRate) {
  const businessPortion = price * businessUse
  const instantWriteOffEligible = businessPortion > 0 && businessPortion <= INSTANT_WRITEOFF_THRESHOLD

  let taxSavingsYear1 = 0
  let totalTaxSavings = 0

  if (instantWriteOffEligible) {
    taxSavingsYear1 = businessPortion * taxRate
    totalTaxSavings = taxSavingsYear1
  } else {
    const depRate = DEPRECIATION_RATES[vehicleType] || 0.25
    let remainingValue = businessPortion
    for (let year = 1; year <= years; year++) {
      const depreciation = remainingValue * depRate
      const taxSaving = depreciation * taxRate
      totalTaxSavings += taxSaving
      if (year === 1) taxSavingsYear1 = taxSaving
      remainingValue -= depreciation
    }
  }

  return {
    instantWriteOffEligible,
    taxSavingsYear1,
    totalTaxSavings,
    method: instantWriteOffEligible ? 'Instant Write-Off' : 'Depreciation'
  }
}

function calculateRunningCosts(vehicleType, annualKm, businessUse, years) {
  const costPerKm = RUNNING_COSTS_PER_KM[vehicleType] || 0.70
  const annualCost = annualKm * costPerKm
  const businessCost = annualCost * businessUse
  const totalOverOwnership = businessCost * years
  const monthlyRunningCost = businessCost / 12
  return { annualRunningCost: businessCost, monthlyRunningCost, totalOverOwnership }
}

function calculateFBT(price, businessUsePct, entityType) {
  const warnings = []
  if (businessUsePct < 100 && entityType !== 'individual') {
    const privateUse = 100 - businessUsePct
    const fbtLiability = price * FBT_STATUTORY_RATE * FBT_RATE * (privateUse / 100)
    warnings.push({
      severity: 'warning',
      message: `${privateUse}% private use may trigger ~$${Math.round(fbtLiability).toLocaleString()} annual FBT liability.`
    })
  }
  return warnings
}

function calculateTotalCost(price, interest, runningCosts, taxSavings) {
  const totalOutlay = price + interest + runningCosts
  const netCost = totalOutlay - taxSavings
  return { totalOutlay, netCost, taxSavings }
}

function analyzeCashFlow(income, expenses, reserves, loanPayment, runningCost, cashPortion) {
  const monthlyIncome = income / 12
  const monthlyExpenses = expenses / 12
  const totalMonthlyCommitment = loanPayment + runningCost
  const cashAfterPurchase = reserves - cashPortion

  const monthsOfReserves =
    monthlyExpenses > 0 ? cashAfterPurchase / monthlyExpenses : (cashAfterPurchase > 0 ? 99 : 0)

  const paymentToIncomeRatio =
    monthlyIncome > 0 ? totalMonthlyCommitment / monthlyIncome : 0

  return {
    monthlyIncome,
    monthlyExpenses,
    totalMonthlyCommitment,
    cashAfterPurchase,
    monthsOfReserves,
    paymentToIncomeRatio
  }
}

function generateRiskFlags(cashFlow, lct, fbt, businessUsePct, annualKm, price, income) {
  const flags = []

  if (cashFlow.monthsOfReserves < 1) {
    flags.push({ severity: 'critical', message: 'Less than 1 month expenses in reserves after purchase - very risky.' })
  } else if (cashFlow.monthsOfReserves < 3) {
    flags.push({ severity: 'warning', message: 'Less than 3 months expenses in reserves - limited buffer.' })
  }

  if (cashFlow.paymentToIncomeRatio > 0.25) {
    flags.push({ severity: 'critical', message: 'Total vehicle costs exceed 25% of monthly income - serious strain.' })
  } else if (cashFlow.paymentToIncomeRatio > 0.15) {
    flags.push({ severity: 'warning', message: 'Vehicle costs exceed 15% of income - above recommended level.' })
  }

  if (lct.hasLCT) {
    flags.push({ severity: 'warning', message: `Luxury car tax of $${Math.round(lct.lctAmount).toLocaleString()} applies - adds to total cost.` })
  }

  const businessKm = annualKm * (businessUsePct / 100)
  if (businessUsePct > 80 && businessKm < 10000) {
    flags.push({ severity: 'warning', message: `Claiming ${businessUsePct}% business use but only ${businessKm.toLocaleString()}km - may face ATO scrutiny.` })
  }

  if (income > 0 && price / income > 0.7) {
    flags.push({ severity: 'advisory', message: 'Vehicle price exceeds 70% of annual income - consider if appropriate.' })
  }

  flags.push(...fbt)
  return flags
}

function generatePositiveFlags(cashFlow, depreciation, businessUsePct, price, reserves) {
  const flags = []

  if (cashFlow.monthsOfReserves > 6 && cashFlow.paymentToIncomeRatio < 0.10) {
    flags.push({ message: 'Strong financial position - healthy reserves with manageable commitments.' })
  }

  if (depreciation.instantWriteOffEligible && businessUsePct >= 80) {
    flags.push({ message: 'Excellent tax position - instant write-off with high business use maximizes benefits.' })
  }

  if (price < reserves * 0.5) {
    flags.push({ message: 'Conservative purchase - vehicle cost is less than half your reserves.' })
  }

  return flags
}

function generateOpportunityFlags(price, totalCostOfOwnership, depreciation, businessUsePct, cashFlow, financePortion, totalInterest) {
  const flags = []

  if (cashFlow.paymentToIncomeRatio > 0.15) {
    const betterPrice = Math.round(price * 0.70)
    flags.push({ message: `A $${betterPrice.toLocaleString()} vehicle would significantly improve cash flow and reduce financial strain.` })
  }

  if (businessUsePct < 80 && businessUsePct > 50 && depreciation.instantWriteOffEligible) {
    flags.push({ message: 'Increasing business use to 80% could provide additional tax benefits while staying under instant write-off threshold.' })
  }

  if (financePortion > 0 && cashFlow.monthsOfReserves > 6 && totalInterest > 5000) {
    const savings = Math.round(totalInterest * 0.3)
    flags.push({ message: `With strong reserves, increasing cash deposit could save ~$${savings.toLocaleString()} in interest.` })
  }

  return flags
}

function calculateScores(depreciation, cashFlow, businessUsePct, taxRate, riskFlags) {
  let taxScore = depreciation.instantWriteOffEligible ? 95 : 75
  if (businessUsePct < 50) taxScore -= 15
  if (taxRate === 0) taxScore -= 10
  taxScore = Math.max(0, Math.min(100, taxScore))

  let cashFlowScore = 100
  if (cashFlow.paymentToIncomeRatio > 0.25) cashFlowScore = 30
  else if (cashFlow.paymentToIncomeRatio > 0.15) cashFlowScore = 55
  else if (cashFlow.paymentToIncomeRatio > 0.10) cashFlowScore = 75
  else if (cashFlow.paymentToIncomeRatio > 0.05) cashFlowScore = 88

  let safetyScore =
    cashFlow.monthsOfReserves < 1 ? 25
      : cashFlow.monthsOfReserves < 3 ? 55
      : cashFlow.monthsOfReserves < 6 ? 80
      : 100

  let overall = taxScore * 0.35 + cashFlowScore * 0.35 + safetyScore * 0.30

  const criticalCount = riskFlags.filter(r => r.severity === 'critical').length
  const warningCount = riskFlags.filter(r => r.severity === 'warning').length
  const advisoryCount = riskFlags.filter(r => r.severity === 'advisory').length

  overall -= (criticalCount * 7 + warningCount * 4 + advisoryCount * 2)
  overall = Math.round(Math.max(0, Math.min(100, overall)))

  return {
    overall,
    taxScore: Math.round(taxScore),
    cashFlowScore: Math.round(cashFlowScore),
    safetyScore: Math.round(safetyScore)
  }
}

function generateSummary(score, riskFlags) {
  const criticalRisks = riskFlags.filter(r => r.severity === 'critical')
  if (score >= 80) return 'This looks like a sensible purchase based on the numbers.'
  if (score >= 60) return 'This could work but be mindful of the risks highlighted below.'
  if (criticalRisks.length > 0) return 'This purchase looks quite risky - see critical concerns below.'
  return 'This purchase looks aggressive - consider adjusting price or timing.'
}

function toLegacyUiShape(structured) {
  // Match your current UI expectations (strings for some fields)
  return {
    overall: structured.scores.overall,
    taxScore: structured.scores.taxScore,
    cashFlowScore: structured.scores.cashFlowScore,
    safetyScore: structured.scores.safetyScore,

    monthlyPayment: String(round0(structured.finance.monthlyPayment)),
    totalInterest: String(round0(structured.finance.totalInterest)),

    cashAfterPurchase: String(round0(structured.cashFlow.cashAfterPurchase)),
    monthsOfReserves: String(round1(structured.cashFlow.monthsOfReserves)),

    totalCostOfOwnership: String(round0(structured.totalCostOfOwnership)),

    lctAmount: String(round0(structured.tax.lctAmount)),
    hasLCT: structured.tax.hasLCT,

    instantWriteOffEligible: structured.tax.instantWriteOffEligible,
    taxSavingsYear1: String(round0(structured.tax.taxSavingsYear1)),
    totalTaxSavings: String(round0(structured.tax.totalTaxSavings)),

    monthlyRunningCost: String(round0(structured.running.monthlyRunningCost)),
    totalRunningCosts: String(round0(structured.running.totalRunningCosts)),

    riskFlags: structured.flags.riskFlags,
    positiveFlags: structured.flags.positiveFlags,
    opportunityFlags: structured.flags.opportunityFlags,
    fbtWarnings: structured.flags.fbtWarnings,

    summary: structured.summary
  }
}

/**
 * Main engine entry.
 * @param {VehicleInputs} formData
 * @returns {{ issues: ValidationIssue[], results: VehicleResults|null }}
 */
export function runVehicleEngine(formData) {
  const issues = validateVehicleInputs(formData)

  // Parse inputs (same defaults as your current component)
  const price = toNumber(formData.vehiclePrice, 0)
  const income = toNumber(formData.annualIncome, 0)
  const expenses = toNumber(formData.annualExpenses, 0)
  const reserves = toNumber(formData.cashReserves, 0)

  const businessUsePct = toNumber(formData.businessUse, 0)
  const businessUse = businessUsePct / 100

  const annualKm = toNumber(formData.annualKm, 15000)
  const vehicleType = formData.vehicleType || 'sedan'
  const ownershipYears = Math.max(1, Math.round(toNumber(formData.ownershipPeriod, 5)))

  const entityType = formData.entityType || 'individual'
  const paymentMethod = formData.paymentMethod || 'finance'

  const loanTerm = Math.max(1, Math.round(toNumber(formData.loanTerm, 5)))
  const interestRate = toNumber(formData.interestRate, 7.5) / 100

  const cashAmount = toNumber(formData.cashAmount, NaN)
  const financeAmount = toNumber(formData.financeAmount, NaN)

  // Finance
  const finance = calculateFinanceDetails(price, paymentMethod, loanTerm, interestRate, cashAmount, financeAmount)

  // LCT
  const lct = calculateLCT(price, vehicleType)

  // Tax rate
  const taxableIncome = Math.max(0, income - expenses)
  const taxRate = calculateTaxRate(taxableIncome, entityType)

  // Depreciation / write-off
  const depreciation = calculateDepreciation(price, vehicleType, businessUse, ownershipYears, taxRate)

  // Running costs
  const runningCosts = calculateRunningCosts(vehicleType, annualKm, businessUse, ownershipYears)

  // FBT warnings
  const fbtWarnings = calculateFBT(price, businessUsePct, entityType)

  // Total cost of ownership
  const totalCostOfOwnership = calculateTotalCost(
    price,
    finance.totalInterest,
    runningCosts.totalOverOwnership,
    depreciation.totalTaxSavings
  )

  // Cash flow analysis
  const cashFlow = analyzeCashFlow(
    income,
    expenses,
    reserves,
    finance.monthlyPayment,
    runningCosts.monthlyRunningCost,
    finance.cashPortion
  )

  // Flags
  const riskFlags = generateRiskFlags(
    cashFlow,
    lct,
    fbtWarnings,
    businessUsePct,
    annualKm,
    price,
    income
  )

  const positiveFlags = generatePositiveFlags(
    cashFlow,
    depreciation,
    businessUsePct,
    price,
    reserves
  )

  const opportunityFlags = generateOpportunityFlags(
    price,
    totalCostOfOwnership,
    depreciation,
    businessUsePct,
    cashFlow,
    finance.financePortion,
    finance.totalInterest
  )

  // Scores
  const scores = calculateScores(depreciation, cashFlow, businessUsePct, taxRate, riskFlags)

  // Summary
  const summary = generateSummary(scores.overall, riskFlags)

  /** @type {VehicleResults} */
  const results = {
    scores,
    finance,
    tax: {
      hasLCT: lct.hasLCT,
      lctAmount: lct.lctAmount,
      lctThreshold: lct.threshold,
      instantWriteOffEligible: depreciation.instantWriteOffEligible,
      taxSavingsYear1: depreciation.taxSavingsYear1,
      totalTaxSavings: depreciation.totalTaxSavings
    },
    running: {
      monthlyRunningCost: runningCosts.monthlyRunningCost,
      totalRunningCosts: runningCosts.totalOverOwnership
    },
    cashFlow: {
      cashAfterPurchase: cashFlow.cashAfterPurchase,
      monthsOfReserves: cashFlow.monthsOfReserves,
      paymentToIncomeRatio: cashFlow.paymentToIncomeRatio
    },
    flags: {
      riskFlags,
      positiveFlags,
      opportunityFlags,
      fbtWarnings
    },
    summary,
    calculatedAt: new Date(),

    // totals (handy)
    totalCostOfOwnership: totalCostOfOwnership.netCost,

    // legacy adapter for current UI
    ui: null
  }

  results.ui = toLegacyUiShape(results)

  return { issues, results }
}
