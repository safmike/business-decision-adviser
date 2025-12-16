/**
 * vehicleTypes.js
 * Single source of truth for Vehicle Purchase Analysis shapes
 */

/**
 * @typedef {'cash'|'finance'|'split'} PaymentMethod
 * @typedef {'sedan'|'suv'|'ute'|'van'|'truck'|'luxury'} VehicleType
 * @typedef {'individual'|'company'|'trust'|'partnership'} EntityType
 * @typedef {'error'|'warning'|'info'} IssueSeverity
 */

/**
 * @typedef {Object} ValidationIssue
 * @property {string} field
 * @property {IssueSeverity} severity
 * @property {string} message
 * @property {string} [suggestion]
 */

/**
 * @typedef {Object} VehicleInputs
 * @property {string} decisionId
 * @property {string} decisionName
 * @property {number|string} vehiclePrice
 * @property {number|string} businessUse
 * @property {PaymentMethod} paymentMethod
 * @property {number|string} cashAmount
 * @property {number|string} financeAmount
 * @property {number|string} loanTerm
 * @property {number|string} interestRate
 * @property {number|string} annualIncome
 * @property {number|string} annualExpenses
 * @property {number|string} cashReserves
 * @property {number|string} annualKm
 * @property {VehicleType} vehicleType
 * @property {number|string} ownershipPeriod
 * @property {EntityType} entityType
 */

/**
 * Structured results (platform-friendly).
 * NOTE: we also include a `ui` object for backward-compat with the current ResultsPanel.
 *
 * @typedef {Object} VehicleResults
 * @property {Object} scores
 * @property {number} scores.overall
 * @property {number} scores.taxScore
 * @property {number} scores.cashFlowScore
 * @property {number} scores.safetyScore
 *
 * @property {Object} finance
 * @property {number} finance.monthlyPayment
 * @property {number} finance.totalInterest
 * @property {number} finance.financePortion
 * @property {number} finance.cashPortion
 *
 * @property {Object} tax
 * @property {boolean} tax.hasLCT
 * @property {number} tax.lctAmount
 * @property {number} tax.lctThreshold
 * @property {boolean} tax.instantWriteOffEligible
 * @property {number} tax.taxSavingsYear1
 * @property {number} tax.totalTaxSavings
 *
 * @property {Object} running
 * @property {number} running.monthlyRunningCost
 * @property {number} running.totalRunningCosts
 *
 * @property {Object} cashFlow
 * @property {number} cashFlow.cashAfterPurchase
 * @property {number} cashFlow.monthsOfReserves
 * @property {number} cashFlow.paymentToIncomeRatio
 *
 * @property {Object[]} flags
 * @property {Object[]} flags.riskFlags
 * @property {Object[]} flags.positiveFlags
 * @property {Object[]} flags.opportunityFlags
 * @property {Object[]} flags.fbtWarnings
 *
 * @property {string} summary
 * @property {Date} calculatedAt
 *
 * @property {Object} ui   // legacy flat shape used by current UI
 */

export {}
