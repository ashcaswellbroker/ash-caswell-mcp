// Pure calculation helpers. No network calls, no stored data.

const round2 = (n: number) => Math.round(n * 100) / 100;
const ceilPer100 = (amount: number) => Math.ceil(amount / 100);

/** Monthly principal + interest payment. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0;
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Florida promulgated original title insurance premium (Rule 69O-186.003, F.A.C.). */
export function floridaTitlePremium(amount: number): number {
  if (amount <= 0) return 0;
  // Any fraction of $100 counts as a full $100.
  const a = Math.ceil(amount / 100) * 100;
  const tiers: Array<[number, number]> = [
    [100_000, 5.75],
    [1_000_000, 5.0],
    [5_000_000, 2.5],
    [10_000_000, 2.25],
    [Infinity, 2.0],
  ];
  let premium = 0;
  let prev = 0;
  for (const [cap, rate] of tiers) {
    if (a <= prev) break;
    const slice = Math.min(a, cap) - prev;
    premium += (slice / 1000) * rate;
    prev = cap;
  }
  return Math.max(100, round2(premium));
}

export interface ClosingCostInput {
  purchasePrice: number;
  loanAmount: number;
}

export function floridaClosingCosts({ purchasePrice, loanAmount }: ClosingCostInput) {
  const deedDocStamps = round2(ceilPer100(purchasePrice) * 0.7);
  const noteDocStamps = loanAmount > 0 ? round2(ceilPer100(loanAmount) * 0.35) : 0;
  const intangibleTax = loanAmount > 0 ? round2(loanAmount * 0.002) : 0;
  const ownersTitlePolicy = floridaTitlePremium(purchasePrice);
  return {
    deedDocStamps,
    noteDocStamps,
    intangibleTax,
    ownersTitlePolicy,
    notes: [
      "Deed documentary stamp tax: $0.70 per $100 of the sale price (s. 201.02, F.S.). The seller customarily pays it, but it's negotiable.",
      "Note documentary stamp tax: $0.35 per $100 of the loan amount (s. 201.08, F.S.). The buyer pays it on financed purchases.",
      "Intangible tax on a new mortgage: 2 mills, or $0.002 per $1 (s. 199.133, F.S.). The buyer pays it on financed purchases.",
      "Owner's title policy: Florida promulgated rate (Rule 69O-186.003, F.A.C.), the same at every title company. Who pays is set in the contract and by local custom.",
      "Not included: lender fees, the lender's title policy and endorsements, settlement and search fees, recording fees, survey, inspections, prorated property taxes, HOA estoppel and capital contributions, and insurance escrows.",
    ],
  };
}

export interface RentalInput {
  purchasePrice: number;
  downPaymentPct: number;
  interestRatePct: number;
  loanYears: number;
  avgNightlyRate: number;
  occupancyPct: number;
  annualHoa: number;
  annualPropertyTax: number;
  annualInsurance: number;
  managementFeePct: number;
  maintenancePct: number;
  platformFeePct: number;
  annualUtilities: number;
}

export function rentalAnalysis(i: RentalInput) {
  const nightsBooked = Math.round(365 * (i.occupancyPct / 100));
  const grossRent = i.avgNightlyRate * nightsBooked;
  const management = grossRent * (i.managementFeePct / 100);
  const maintenance = grossRent * (i.maintenancePct / 100);
  const platformFees = grossRent * (i.platformFeePct / 100);
  const operatingExpenses =
    management +
    maintenance +
    platformFees +
    i.annualHoa +
    i.annualPropertyTax +
    i.annualInsurance +
    i.annualUtilities;
  const noi = grossRent - operatingExpenses;

  const downPayment = i.purchasePrice * (i.downPaymentPct / 100);
  const loanAmount = i.purchasePrice - downPayment;
  const monthlyPI = monthlyPayment(loanAmount, i.interestRatePct, i.loanYears);
  const annualDebtService = monthlyPI * 12;
  const cashFlow = noi - annualDebtService;

  const closing = floridaClosingCosts({ purchasePrice: i.purchasePrice, loanAmount });
  const buyerTaxes = closing.noteDocStamps + closing.intangibleTax;
  const cashInvested = downPayment + buyerTaxes;

  return {
    nightsBooked,
    grossRent: round2(grossRent),
    expenses: {
      management: round2(management),
      maintenance: round2(maintenance),
      platformFees: round2(platformFees),
      hoa: i.annualHoa,
      propertyTax: i.annualPropertyTax,
      insurance: i.annualInsurance,
      utilities: i.annualUtilities,
      total: round2(operatingExpenses),
    },
    netOperatingIncome: round2(noi),
    capRatePct: i.purchasePrice > 0 ? round2((noi / i.purchasePrice) * 100) : 0,
    loanAmount: round2(loanAmount),
    downPayment: round2(downPayment),
    monthlyPrincipalAndInterest: round2(monthlyPI),
    annualDebtService: round2(annualDebtService),
    annualCashFlow: round2(cashFlow),
    monthlyCashFlow: round2(cashFlow / 12),
    cashInvestedEstimate: round2(cashInvested),
    cashOnCashReturnPct: cashInvested > 0 ? round2((cashFlow / cashInvested) * 100) : 0,
    breakEvenOccupancyPct:
      i.avgNightlyRate > 0
        ? round2(
            (((i.annualHoa + i.annualPropertyTax + i.annualInsurance + i.annualUtilities + annualDebtService) /
              (1 - (i.managementFeePct + i.maintenancePct + i.platformFeePct) / 100)) /
              (i.avgNightlyRate * 365)) *
              100,
          )
        : 0,
  };
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
