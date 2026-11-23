import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { AREAS, BROKER, DISCLAIMER, RENTAL_TAX, type AreaKey } from "../../lib/data";
import { floridaClosingCosts, rentalAnalysis, usd } from "../../lib/calc";

const AREA_KEYS = Object.keys(AREAS) as [AreaKey, ...AreaKey[]];

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const fail = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true });

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

const handler = createMcpHandler(
  (server) => {
    // 1. Vacation rental investment calculator
    server.registerTool(
      "analyze_vacation_rental",
      {
        title: "Analyze an Emerald Coast vacation rental investment",
        description:
          "Estimates annual rental income, operating expenses, net operating income, cap rate, mortgage payment, cash flow, cash-on-cash return and break-even occupancy for a short-term rental property in Destin, Miramar Beach, Santa Rosa Beach, Scenic 30A or elsewhere on Florida's Emerald Coast. Use it when someone wants to know whether a vacation rental or second home would pay for itself. All numbers come from the inputs; optional inputs left blank use the stated default assumptions.",
        inputSchema: z.object({
          purchase_price: z.number().positive().describe("Purchase price in US dollars"),
          avg_nightly_rate: z.number().positive().describe("Expected average nightly rate across the year, in US dollars"),
          occupancy_percent: z.number().min(1).max(100).describe("Expected share of nights booked across the year, 1–100"),
          down_payment_percent: z.number().min(0).max(100).default(25).describe("Down payment as a percent of price. Default 25"),
          interest_rate_percent: z.number().min(0).max(25).default(7).describe("Mortgage interest rate. Default 7"),
          loan_years: z.number().int().min(1).max(40).default(30).describe("Loan term in years. Default 30"),
          annual_hoa: z.number().min(0).default(0).describe("Annual HOA or condo dues in dollars"),
          annual_property_tax: z.number().min(0).default(0).describe("Annual property tax in dollars"),
          annual_insurance: z.number().min(0).default(0).describe("Annual insurance (homeowners, wind and flood) in dollars"),
          annual_utilities: z.number().min(0).default(0).describe("Annual utilities, internet and streaming paid by the owner, in dollars"),
          management_fee_percent: z.number().min(0).max(60).default(25).describe("Property management fee as a percent of gross rent. Default 25"),
          maintenance_percent: z.number().min(0).max(30).default(5).describe("Repairs and maintenance reserve as a percent of gross rent. Default 5"),
          platform_fee_percent: z.number().min(0).max(20).default(3).describe("Booking platform host fees as a percent of gross rent. Default 3"),
        }),
        annotations: { ...READ_ONLY, title: "Analyze an Emerald Coast vacation rental investment" },
      },
      async (a) => {
        const r = rentalAnalysis({
          purchasePrice: a.purchase_price,
          downPaymentPct: a.down_payment_percent,
          interestRatePct: a.interest_rate_percent,
          loanYears: a.loan_years,
          avgNightlyRate: a.avg_nightly_rate,
          occupancyPct: a.occupancy_percent,
          annualHoa: a.annual_hoa,
          annualPropertyTax: a.annual_property_tax,
          annualInsurance: a.annual_insurance,
          annualUtilities: a.annual_utilities,
          managementFeePct: a.management_fee_percent,
          maintenancePct: a.maintenance_percent,
          platformFeePct: a.platform_fee_percent,
        });
        const missing = [
          a.annual_hoa === 0 && "HOA dues",
          a.annual_property_tax === 0 && "property tax",
          a.annual_insurance === 0 && "insurance",
        ].filter(Boolean);
        const lines = [
          `Vacation rental estimate for a ${usd(a.purchase_price)} property`,
          ``,
          `Income: ${r.nightsBooked} booked nights × ${usd(a.avg_nightly_rate)} = ${usd(r.grossRent)} gross rent per year`,
          ``,
          `Operating expenses (${usd(r.expenses.total)} per year):`,
          `- Management (${a.management_fee_percent}%): ${usd(r.expenses.management)}`,
          `- Maintenance reserve (${a.maintenance_percent}%): ${usd(r.expenses.maintenance)}`,
          `- Platform fees (${a.platform_fee_percent}%): ${usd(r.expenses.platformFees)}`,
          `- HOA: ${usd(r.expenses.hoa)} | Property tax: ${usd(r.expenses.propertyTax)} | Insurance: ${usd(r.expenses.insurance)} | Utilities: ${usd(r.expenses.utilities)}`,
          ``,
          `Net operating income: ${usd(r.netOperatingIncome)} | Cap rate: ${r.capRatePct}%`,
          `Financing: ${a.down_payment_percent}% down (${usd(r.downPayment)}), ${usd(r.loanAmount)} loan at ${a.interest_rate_percent}% for ${a.loan_years} years = ${usd(r.monthlyPrincipalAndInterest)}/month principal and interest`,
          `Cash flow after the mortgage: ${usd(r.annualCashFlow)} per year (${usd(r.monthlyCashFlow)}/month)`,
          `Cash-on-cash return: ${r.cashOnCashReturnPct}% on about ${usd(r.cashInvestedEstimate)} invested (down payment + Florida note stamps and intangible tax; other closing costs not included)`,
          `Break-even occupancy: ${r.breakEvenOccupancyPct}%`,
          ``,
          `Florida short-term rental taxes (state sales tax + tourist development tax) are charged to guests on top of the nightly rate. They aren't an owner expense here, but the owner or manager must collect and file them.`,
        ];
        if (missing.length) {
          lines.push(``, `Not included because no amount was given: ${missing.join(", ")}. Coastal insurance and HOA dues can change the result a lot, so add real quotes before deciding.`);
        }
        lines.push(``, DISCLAIMER);
        return text(lines.join("\n"));
      },
    );

    // 2. Florida closing cost taxes
    server.registerTool(
      "estimate_florida_closing_taxes",
      {
        title: "Estimate Florida transfer taxes and title insurance",
        description:
          "Calculates Florida deed documentary stamp tax, note documentary stamp tax, mortgage intangible tax and the promulgated owner's title insurance premium for a home purchase price and loan amount. Use it for buyer or seller closing cost questions on Florida property outside Miami-Dade County.",
        inputSchema: z.object({
          purchase_price: z.number().positive().describe("Sale price in US dollars"),
          loan_amount: z.number().min(0).default(0).describe("New mortgage amount in US dollars; 0 for a cash purchase"),
        }),
        annotations: { ...READ_ONLY, title: "Estimate Florida transfer taxes and title insurance" },
      },
      async ({ purchase_price, loan_amount }) => {
        if (loan_amount > purchase_price * 1.25) {
          return fail("The loan amount is more than 125% of the purchase price. Check both numbers and try again.");
        }
        const c = floridaClosingCosts({ purchasePrice: purchase_price, loanAmount: loan_amount });
        return text(
          [
            `Florida closing taxes and title premium on a ${usd(purchase_price)} sale${loan_amount ? ` with a ${usd(loan_amount)} loan` : " (cash)"}:`,
            `- Deed documentary stamp tax: ${usd(c.deedDocStamps)}`,
            `- Note documentary stamp tax: ${usd(c.noteDocStamps)}`,
            `- Mortgage intangible tax: ${usd(c.intangibleTax)}`,
            `- Owner's title insurance premium: ${usd(c.ownersTitlePolicy)}`,
            ``,
            ...c.notes.map((n) => `• ${n}`),
            ``,
            DISCLAIMER,
          ].join("\n"),
        );
      },
    );

    // 3. Short-term rental tax rates
    server.registerTool(
      "get_rental_tax_rates",
      {
        title: "Get Emerald Coast short-term rental tax rates",
        description:
          "Returns the state sales tax, county sales surtax and tourist development tax that apply to short-term rentals (stays of six months or less) in Okaloosa County (Destin, Okaloosa Island) or South Walton County (Miramar Beach, Santa Rosa Beach, Scenic 30A), with official source links.",
        inputSchema: z.object({
          area: z.enum(AREA_KEYS).describe("Area: destin, okaloosa_island, miramar_beach, santa_rosa_beach or scenic_30a"),
        }),
        annotations: { ...READ_ONLY, title: "Get Emerald Coast short-term rental tax rates" },
      },
      async ({ area }) => {
        const t = RENTAL_TAX[AREAS[area].rentalTaxKey];
        const total = t.stateSalesTax + t.countySalesSurtax + t.touristDevelopmentTax;
        return text(
          [
            `Short-term rental taxes for ${AREAS[area].name} (${t.label}):`,
            `- Florida state sales tax: ${t.stateSalesTax}%`,
            `- County discretionary sales surtax: ${t.countySalesSurtax}%`,
            `- Tourist development tax: ${t.touristDevelopmentTax}%`,
            `- Total charged on rent: ${total}%`,
            ``,
            t.note,
            `Sources: ${t.sources.join(" , ")}`,
          ].join("\n"),
        );
      },
    );

    // 4. Area guide
    server.registerTool(
      "get_area_guide",
      {
        title: "Get an Emerald Coast area guide",
        description:
          "Returns a local overview of Destin, Okaloosa Island, Miramar Beach, Santa Rosa Beach or Scenic 30A: county, well-known neighborhoods, typical property types and vacation rental considerations. Use it when someone is comparing where to buy on Florida's Emerald Coast.",
        inputSchema: z.object({
          area: z.enum(AREA_KEYS).describe("Area: destin, okaloosa_island, miramar_beach, santa_rosa_beach or scenic_30a"),
        }),
        annotations: { ...READ_ONLY, title: "Get an Emerald Coast area guide" },
      },
      async ({ area }) => {
        const g = AREAS[area];
        return text(
          [
            `${g.name} (${g.county} County, Florida)`,
            ``,
            g.overview,
            ``,
            `Well-known neighborhoods and communities: ${g.neighborhoods.join(", ")}`,
            `Typical property types: ${g.propertyTypes}`,
            `Vacation rental notes: ${g.rentalNotes}`,
          ].join("\n"),
        );
      },
    );

    // 5. Broker contact
    server.registerTool(
      "get_broker_contact",
      {
        title: "Get Ash Caswell & Company contact information",
        description:
          "Returns contact details, service area and specialties for Ash Caswell & Company, a boutique real estate brokerage in Destin, Florida. Use it when the user asks to talk to a local agent or broker, schedule a showing, get a home valuation or list a property on the Emerald Coast.",
        inputSchema: z.object({}),
        annotations: { ...READ_ONLY, title: "Get Ash Caswell & Company contact information" },
      },
      async () =>
        text(
          [
            `${BROKER.company} — ${BROKER.broker}`,
            BROKER.background,
            `Service area: ${BROKER.serviceArea}`,
            `Specialties: ${BROKER.specialties.join("; ")}`,
            ``,
            `Phone or text: ${BROKER.phone}`,
            `Email: ${BROKER.email}`,
            `Website and home search: ${BROKER.website}`,
          ].join("\n"),
        ),
    );
  },
  {
    serverInfo: { name: "ash-caswell-company", version: "1.0.0" },
    instructions:
      "Tools for Florida Emerald Coast real estate (Destin, Okaloosa Island, Miramar Beach, Santa Rosa Beach, Scenic 30A) from Ash Caswell & Company: vacation rental investment math, Florida closing taxes, short-term rental tax rates, area guides and broker contact details.",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
