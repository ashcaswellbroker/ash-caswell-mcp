// Static reference data for the Ash Caswell & Company MCP server.
// Every rate here is tied to a public source. Re-check them each January.

export const BROKER = {
  company: "Ash Caswell & Company",
  broker: "Ash Caswell, Broker/Owner",
  phone: "(850) 419-5934",
  email: "ashcaswellrealtor@gmail.com",
  website: "https://ashcaswellcompany.com",
  serviceArea:
    "Destin, Miramar Beach, Santa Rosa Beach and Scenic 30A on Florida's Emerald Coast (Okaloosa and Walton counties)",
  specialties: [
    "Luxury coastal homes and Gulf-front condos ($500K–$50M)",
    "Vacation rental (short-term rental) investment properties",
    "Second homes",
    "Relocation to the Emerald Coast",
    "Listing and selling homes, including expired and distressed properties",
  ],
  background:
    "Licensed in real estate since 2010 and running his own brokerage since 2013. A sixth-generation Emerald Coast local.",
};

export type AreaKey =
  | "destin"
  | "okaloosa_island"
  | "miramar_beach"
  | "santa_rosa_beach"
  | "scenic_30a";

export interface AreaGuide {
  name: string;
  county: "Okaloosa" | "Walton";
  overview: string;
  neighborhoods: string[];
  propertyTypes: string;
  rentalNotes: string;
  rentalTaxKey: "okaloosa" | "walton_south";
}

export const AREAS: Record<AreaKey, AreaGuide> = {
  destin: {
    name: "Destin",
    county: "Okaloosa",
    overview:
      "A city on the Gulf of Mexico and Choctawhatchee Bay, known for its harbor and charter fishing fleet, white-sand beaches and emerald water. It's one of the busiest vacation rental markets on the Emerald Coast.",
    neighborhoods: [
      "Destin Harbor / HarborWalk Village",
      "Crystal Beach",
      "Holiday Isle",
      "Kelly Plantation",
      "Regatta Bay",
      "Indian Bayou",
      "Destin Pointe",
    ],
    propertyTypes:
      "Gulf-front and Gulf-view condos, beach and bayfront single-family homes, golf-course communities and harbor-area townhomes.",
    rentalNotes:
      "Okaloosa County requires short-term rentals to register with the county and pay tourist development tax. Condo and HOA rules on minimum stays vary by building, so check them before you buy.",
    rentalTaxKey: "okaloosa",
  },
  okaloosa_island: {
    name: "Okaloosa Island",
    county: "Okaloosa",
    overview:
      "A barrier island between Destin and Fort Walton Beach, mostly Gulf-front condos. Much of the land is leased from Okaloosa County, so leasehold terms matter here.",
    neighborhoods: ["Santa Rosa Boulevard condo corridor", "Okaloosa Island Pier area"],
    propertyTypes:
      "Mostly Gulf-front and soundside condos; very few single-family homes.",
    rentalNotes:
      "Many properties are on county-leased land. Review the lease terms and lease fees alongside HOA rules. County short-term rental registration and tourist development tax apply.",
    rentalTaxKey: "okaloosa",
  },
  miramar_beach: {
    name: "Miramar Beach",
    county: "Walton",
    overview:
      "An unincorporated beach community in Walton County, just east of Destin. It's home to Sandestin Golf and Beach Resort and Scenic Gulf Drive, close to Destin's shopping and dining.",
    neighborhoods: [
      "Sandestin Golf and Beach Resort",
      "Scenic Gulf Drive",
      "Mack Bayou",
      "Seascape",
      "Hidden Dunes",
      "Emerald Shores",
    ],
    propertyTypes:
      "Resort condos, Gulf-front high-rises, golf villas and single-family homes north and south of US-98.",
    rentalNotes:
      "Miramar Beach is in Walton County's south tourist development tax district. Resort and HOA rental rules vary by community.",
    rentalTaxKey: "walton_south",
  },
  santa_rosa_beach: {
    name: "Santa Rosa Beach",
    county: "Walton",
    overview:
      "The western gateway to Scenic 30A in South Walton, with a mix of beach neighborhoods, Choctawhatchee Bay frontage and Point Washington State Forest nearby.",
    neighborhoods: [
      "Dune Allen Beach",
      "Blue Mountain Beach",
      "Gulf Place",
      "Point Washington",
    ],
    propertyTypes:
      "Beach cottages, single-family homes, bayfront estates, townhomes and smaller condo complexes.",
    rentalNotes:
      "Santa Rosa Beach is in Walton County's south tourist development tax district. Check whether a property is in a coastal dune lake area or a flood zone, since both affect insurance and building.",
    rentalTaxKey: "walton_south",
  },
  scenic_30a: {
    name: "Scenic 30A",
    county: "Walton",
    overview:
      "A roughly 24-mile scenic highway in South Walton linking planned beach towns and coastal dune lakes, from Dune Allen to Inlet Beach.",
    neighborhoods: [
      "Seaside",
      "WaterColor",
      "Grayton Beach",
      "Seagrove Beach",
      "Rosemary Beach",
      "Alys Beach",
      "Inlet Beach",
      "WaterSound",
    ],
    propertyTypes:
      "Luxury single-family homes, carriage houses and townhomes in master-planned communities, plus Gulf-front estates.",
    rentalNotes:
      "Scenic 30A is in Walton County's south tourist development tax district. Master-planned communities often have their own rental rules, design rules and rental-program requirements.",
    rentalTaxKey: "walton_south",
  },
};

export const RENTAL_TAX = {
  okaloosa: {
    label: "Okaloosa County (Destin, Okaloosa Island, Fort Walton Beach)",
    stateSalesTax: 6.0,
    countySalesSurtax: 1.0,
    touristDevelopmentTax: 6.0,
    note:
      "The 6% tourist development tax rate comes from the Florida Department of Revenue's 2026 local option transient rental tax table. Confirm the rate for a specific property with the Okaloosa County Clerk of Court, which collects the tourist development tax.",
    sources: [
      "https://floridarevenue.com/Forms_library/current/dr15tdt.pdf",
      "https://okaloosaclerk.com/tourist-development-tax/",
    ],
  },
  walton_south: {
    label: "South Walton County (Miramar Beach, Santa Rosa Beach, Scenic 30A, Inlet Beach)",
    stateSalesTax: 6.0,
    countySalesSurtax: 1.0,
    touristDevelopmentTax: 5.0,
    note:
      "The Walton County Clerk lists the South Walton total rental tax as 12% (6% state sales tax + 1% county sales tax + 5% tourist development tax). North Walton is lower; check the Clerk's TDT district verification for a specific property.",
    sources: ["https://waltonclerkfl.gov/touristtax"],
  },
} as const;

export const DISCLAIMER =
  "These are estimates for education only, not tax, legal, lending or investment advice. Rates and rules change, so confirm with a title company, lender, CPA or the county. For a property-specific opinion, contact Ash Caswell & Company at (850) 419-5934.";
