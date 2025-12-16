/**
 * src/logic/vehicle/validators.js
 */

/** @typedef {import('../../types/vehicleTypes').VehicleInputs} VehicleInputs */
/** @typedef {import('../../types/vehicleTypes').ValidationIssue} ValidationIssue */

function toNumber(x) {
  const n = typeof x === 'string' && x.trim() === '' ? NaN : Number(x)
  return Number.isFinite(n) ? n : NaN
}

function approxEqual(a, b, tol = 2) {
  return Math.abs(a - b) <= tol
}

/**
 * @param {VehicleInputs|null|undefined} inputs
 * @returns {ValidationIssue[]}
 */
export function validateVehicleInputs(inputs) {
  /** @type {ValidationIssue[]} */
  const issues = []

  if (!inputs) {
    issues.push({
      field: 'inputs',
      severity: 'error',
      message: 'No inputs provided.',
      suggestion: 'Enter details before running the analysis.'
    })
    return issues
  }

  const price = toNumber(inputs.vehiclePrice)
  const businessUse = toNumber(inputs.businessUse)
  const income = toNumber(inputs.annualIncome)
  const expenses = toNumber(inputs.annualExpenses)
  const reserves = toNumber(inputs.cashReserves)
  const loanTerm = toNumber(inputs.loanTerm)
  const interestRate = toNumber(inputs.interestRate)
  const ownership = toNumber(inputs.ownershipPeriod)

  if (!Number.isFinite(price) || price <= 0) {
    issues.push({
      field: 'vehiclePrice',
      severity: 'error',
      message: 'Vehicle price must be a positive number.',
      suggestion: 'Enter a value greater than 0.'
    })
  }

  if (!Number.isFinite(businessUse) || businessUse < 0 || businessUse > 100) {
    issues.push({
      field: 'businessUse',
      severity: 'error',
      message: 'Business use must be between 0 and 100.',
      suggestion: 'Use a percentage from 0 to 100.'
    })
  }

  if (!Number.isFinite(income) || income < 0) {
    issues.push({
      field: 'annualIncome',
      severity: 'warning',
      message: 'Annual income is missing or invalid.',
      suggestion: 'Enter a realistic annual income for better affordability signals.'
    })
  }

  if (!Number.isFinite(expenses) || expenses < 0) {
    issues.push({
      field: 'annualExpenses',
      severity: 'warning',
      message: 'Annual expenses is missing or invalid.',
      suggestion: 'Enter annual expenses for a more accurate cash-flow check.'
    })
  }

  if (!Number.isFinite(reserves) || reserves < 0) {
    issues.push({
      field: 'cashReserves',
      severity: 'warning',
      message: 'Cash reserves is missing or invalid.',
      suggestion: 'Enter your cash buffer to assess safety after purchase.'
    })
  }

  if (inputs.paymentMethod === 'finance' || inputs.paymentMethod === 'split') {
    if (!Number.isFinite(loanTerm) || loanTerm <= 0) {
      issues.push({
        field: 'loanTerm',
        severity: 'error',
        message: 'Loan term must be a positive number of years.',
        suggestion: 'Use 1–7 years typically.'
      })
    }

    if (!Number.isFinite(interestRate) || interestRate < 0 || interestRate > 30) {
      issues.push({
        field: 'interestRate',
        severity: 'warning',
        message: 'Interest rate looks missing or unrealistic.',
        suggestion: 'Enter an annual interest rate in % (e.g., 7.5).'
      })
    }
  }

  if (inputs.paymentMethod === 'split') {
    const cashAmount = toNumber(inputs.cashAmount)
    const financeAmount = toNumber(inputs.financeAmount)

    if (Number.isFinite(cashAmount) && cashAmount < 0) {
      issues.push({
        field: 'cashAmount',
        severity: 'error',
        message: 'Cash deposit cannot be negative.'
      })
    }

    if (Number.isFinite(financeAmount) && financeAmount < 0) {
      issues.push({
        field: 'financeAmount',
        severity: 'error',
        message: 'Finance amount cannot be negative.'
      })
    }

    // If both present, check they match price (within tolerance)
    if (Number.isFinite(price) && Number.isFinite(cashAmount) && Number.isFinite(financeAmount)) {
      if (!approxEqual(cashAmount + financeAmount, price)) {
        issues.push({
          field: 'financeAmount',
          severity: 'warning',
          message: 'Cash + finance does not match the vehicle price.',
          suggestion: 'Ensure cash deposit + finance amount equals the vehicle price.'
        })
      }
    }
  }

  if (!Number.isFinite(ownership) || ownership <= 0 || ownership > 15) {
    issues.push({
      field: 'ownershipPeriod',
      severity: 'warning',
      message: 'Ownership period looks missing or unusual.',
      suggestion: 'Use a realistic ownership period (e.g., 3–7 years).'
    })
  }

  return issues
}
