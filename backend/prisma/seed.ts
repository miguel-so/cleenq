import {
  AdminRole,
  AudienceType,
  PriceUnit,
  Prisma,
  PrismaClient,
  ServiceSegmentType,
} from "../src/generated/prisma";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

const toDecimal = (value?: number | null) =>
  value !== undefined && value !== null ? new Prisma.Decimal(value) : undefined;

type PackageSeed = {
  name: string;
  description: string;
  basePrice?: number;
  priceFrom?: boolean;
  audience: AudienceType;
  priceUnit: PriceUnit;
  minQuantity?: number;
  maxQuantity?: number;
  displayOrder?: number;
  metadata?: Record<string, unknown>;
};

type AddonSeed = {
  name: string;
  description: string;
  price?: number;
  priceFrom?: boolean;
  audience: AudienceType;
  priceUnit: PriceUnit;
  displayOrder?: number;
  metadata?: Record<string, unknown>;
};

type SegmentSeed = {
  name: string;
  description?: string;
  type: ServiceSegmentType;
  displayOrder?: number;
  packages: PackageSeed[];
};

type ServiceSeed = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  segments: SegmentSeed[];
  addOns: AddonSeed[];
};

const serviceSeeds: ServiceSeed[] = [
  {
    slug: "domestic-cleaning",
    name: "Domestic Cleaning",
    summary:
      "Flexible standard, deep, and end-of-lease cleans for Australian homes.",
    description:
      "Professional cleaners delivering routine housekeeping, seasonal deep cleans, and bond-ready end of lease services with eco-friendly products.",
    segments: [
      {
        name: "Standard Clean",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Standard Clean · 1 Bedroom",
            description:
              "General clean covering living areas, kitchen, and bathroom surfaces.",
            basePrice: 99,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Standard Clean · 2 Bedroom",
            description:
              "Dusting, vacuuming, mopping, plus kitchen and bathroom refresh.",
            basePrice: 129,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Standard Clean · 3 Bedroom",
            description: "Full general clean for family-sized homes.",
            basePrice: 159,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Standard Clean · 4 Bedroom",
            description: "Whole-home clean including all rooms and surfaces.",
            basePrice: 189,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
          {
            name: "Standard Clean · 5 Bedroom",
            description: "Comprehensive clean for large properties.",
            basePrice: 219,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 5,
          },
        ],
      },
      {
        name: "Deep Clean",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Deep Clean · 1 Bedroom",
            description:
              "Includes skirting boards, blinds, and detailed wet area scrubs.",
            basePrice: 149,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Deep Clean · 2 Bedroom",
            description: "Extra detail across living areas and bedrooms.",
            basePrice: 179,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Deep Clean · 3 Bedroom",
            description: "Intensive deep clean for family homes.",
            basePrice: 209,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Deep Clean · 4 Bedroom",
            description:
              "High-detail clean with degreasing and fixture detailing.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
          {
            name: "Deep Clean · 5 Bedroom",
            description: "Top-to-bottom refresh for large homes.",
            basePrice: 289,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 5,
          },
        ],
      },
      {
        name: "End of Lease",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 3,
        packages: [
          {
            name: "End of Lease · 1 Bedroom",
            description:
              "Bond-ready clean covering interior windows, oven, and cupboards.",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "End of Lease · 2 Bedroom",
            description: "Comprehensive vacate clean for small apartments.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "End of Lease · 3 Bedroom",
            description: "Meets agency standards for multi-room properties.",
            basePrice: 299,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "End of Lease · 4 Bedroom",
            description: "Thorough move-out clean for large houses.",
            basePrice: 349,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
          {
            name: "End of Lease · 5 Bedroom",
            description:
              "Full property clean guaranteeing inspection success.",
            basePrice: 399,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 5,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Inside Oven Detail",
        description: "Deep clean of oven, racks, and door glass.",
        price: 30,
        audience: AudienceType.RESIDENTIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: false,
        displayOrder: 1,
      },
      {
        name: "Inside Fridge Clean",
        description: "Remove shelves, disinfect surfaces, and deodorise.",
        price: 25,
        audience: AudienceType.RESIDENTIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: false,
        displayOrder: 2,
      },
      {
        name: "Interior Windows",
        description: "Spotless clean of interior glass and tracks.",
        price: 50,
        audience: AudienceType.RESIDENTIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Balcony or Patio",
        description: "Sweep, mop, and tidy outdoor areas up to 10m².",
        price: 25,
        audience: AudienceType.RESIDENTIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "Blind Detailing",
        description: "Dust and wipe Venetian or roller blinds.",
        price: 25,
        audience: AudienceType.RESIDENTIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    summary:
      "Scheduled office, retail, and specialised facility cleaning solutions.",
    description:
      "Reliable commercial cleaning for offices, retail, medical, and industrial sites with flexible scheduling and compliant processes.",
    segments: [
      {
        name: "Office & Retail",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Office Clean · Up to 100m²",
            description: "Daily or weekly clean for small offices or shops.",
            basePrice: 99,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Office Clean · Up to 250m²",
            description: "Comprehensive clean for medium workplaces.",
            basePrice: 149,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Office Clean · Up to 500m²",
            description: "Full clean covering amenities and shared spaces.",
            basePrice: 199,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Corporate Campus Clean",
            description:
              "Multi-level or multi-site corporate cleaning program.",
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Industrial & Warehouse",
        type: ServiceSegmentType.INDUSTRIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Warehouse Clean · Up to 250m²",
            description:
              "Floor sweep, mop, amenities, and touchpoint sanitising.",
            basePrice: 149,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Industrial Facility · Up to 500m²",
            description:
              "Comprehensive clean for production areas and offices.",
            basePrice: 249,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Large Facility · Up to 1,000m²",
            description:
              "Machine, floor, and amenity cleaning for large sites.",
            basePrice: 399,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Complex Industrial Site",
            description:
              "Tailored cleaning for multi-bay or complex facilities.",
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Medical & Education",
        type: ServiceSegmentType.SPECIALTY,
        displayOrder: 3,
        packages: [
          {
            name: "Clinic Clean · Up to 100m²",
            description:
              "Hospital-grade disinfecting and touchpoint sanitising.",
            basePrice: 129,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Facility Clean · Up to 250m²",
            description:
              "Full disinfecting and waste removal for clinics or classrooms.",
            basePrice: 199,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Medical or Education Site · Up to 500m²",
            description:
              "Infection-control compliant cleaning for larger facilities.",
            basePrice: 299,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Extended Campus Clean",
            description: "Custom service for campuses over 500m².",
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Interior & Exterior Window Clean",
        description: "Add window cleaning to your scheduled service.",
        price: 50,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "Carpet Steam Clean",
        description:
          "Deep clean carpets and rugs in high-traffic commercial areas.",
        price: 80,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Hard Floor Machine Polish",
        description: "Buff and seal hard floors for a high-shine finish.",
        price: 100,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Odour Control & Deodorising",
        description: "Neutralise lingering odours in enclosed spaces.",
        price: 40,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Scheduling",
        description: "Night or weekend cleans to suit trading hours.",
        price: 50,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    summary:
      "Crystal-clear window cleaning for residential and commercial properties.",
    description:
      "Purified water systems and professional tools deliver streak-free windows with frame, sill, and track cleaning options.",
    segments: [
      {
        name: "Residential Window Cleaning",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Home Windows · Up to 10 Panels",
            description:
              "Interior and exterior cleaning for small homes or apartments.",
            basePrice: 149,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Home Windows · Up to 20 Panels",
            description:
              "Full window service for medium homes including sills and tracks.",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Home Windows · Up to 30 Panels",
            description:
              "Large home window clean including screens where removable.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Home Windows · Up to 40 Panels",
            description: "Double storey or executive home glass service.",
            basePrice: 299,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Window Cleaning",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Shopfront Glass · Up to 10m",
            description: "Weekly or fortnightly exterior frontage clean.",
            basePrice: 99,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Office Glass · Up to 25 Windows",
            description: "Interior and exterior glass polish for offices.",
            basePrice: 149,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Retail Glass · Up to 50 Windows",
            description:
              "Quarterly glass maintenance for larger commercial sites.",
            basePrice: 249,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "High-Access Window Cleaning",
            description:
              "Water-fed poles or rope access for multi-storey sites.",
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Flyscreen Deep Clean",
        description: "Remove, scrub, and reinstall screens for spotless airflow.",
        price: 3,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: false,
        displayOrder: 1,
      },
      {
        name: "Track Detail Clean",
        description: "Vacuum and wipe window and door tracks.",
        price: 2,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: false,
        displayOrder: 2,
      },
      {
        name: "Skylight Cleaning",
        description: "Clean interior and accessible exterior of skylights.",
        price: 25,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Hard Water Stain Removal",
        description: "Treat calcium and mineral deposits on glass.",
        price: 25,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Window Service",
        description: "Schedule window cleaning outside trading hours.",
        price: 50,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "steam-cleaning",
    name: "Steam Cleaning",
    summary:
      "Hot water extraction for carpets, rugs, upholstery, and mattresses.",
    description:
      "Commercial-grade steam cleaning to remove stains, odours, and allergens from carpets, sofas, rugs, and mattresses.",
    segments: [
      {
        name: "Carpet Steam Cleaning",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Carpet Steam · 1 Bedroom",
            description: "Up to 12m² carpet steam clean with deodoriser.",
            basePrice: 45,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ROOM,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Carpet Steam · 2 Bedrooms",
            description: "Steam and stain treatment for two rooms (up to 25m²).",
            basePrice: 80,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ROOM,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Carpet Steam · 3 Bedrooms",
            description: "Deep clean for three rooms (up to 40m²).",
            basePrice: 120,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ROOM,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Carpet Steam · 4 Bedrooms",
            description:
              "Four rooms (up to 60m²) including traffic area pre-treatment.",
            basePrice: 160,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ROOM,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Upholstery Steam Cleaning",
        type: ServiceSegmentType.SPECIALTY,
        displayOrder: 2,
        packages: [
          {
            name: "Upholstery Steam · Armchair",
            description: "Full seat and back steam clean for fabric chairs.",
            basePrice: 35,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Upholstery Steam · 2-Seater",
            description: "Sanitise and deodorise a standard two-seater lounge.",
            basePrice: 70,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Upholstery Steam · 3-Seater",
            description: "Deep steam clean including cushions and backrests.",
            basePrice: 90,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Upholstery Steam · Sectional / Chaise",
            description: "Extended sofa or modular lounge steaming.",
            basePrice: 110,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Mattress Steam Sanitisation",
        type: ServiceSegmentType.SPECIALTY,
        displayOrder: 3,
        packages: [
          {
            name: "Mattress Steam · Single",
            description: "Dust mite treatment and deodorising for single mattress.",
            basePrice: 60,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Mattress Steam · Double",
            description: "Steam both sides of a double mattress.",
            basePrice: 75,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Mattress Steam · Queen",
            description:
              "Deep sanitisation for queen mattress including deodoriser.",
            basePrice: 90,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Mattress Steam · King",
            description:
              "Full steam clean and quick-dry finish for king mattress.",
            basePrice: 110,
            audience: AudienceType.UNIVERSAL,
            priceUnit: PriceUnit.PER_ITEM,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Heavy Stain Treatment",
        description: "Targeted enzymatic treatment for stubborn carpet stains.",
        price: 25,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ROOM,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "Odour Neutraliser",
        description: "Neutralise pet or smoke odours after steaming.",
        price: 20,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ROOM,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Fabric Protection (Scotchgard)",
        description: "Apply protective coating to carpets after cleaning.",
        price: 30,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ROOM,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Leather Conditioning",
        description: "Treat leather upholstery after steam sanitisation.",
        price: 40,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 4,
      },
    ],
  },
  {
    slug: "high-pressure-cleaning",
    name: "High Pressure Cleaning",
    summary:
      "Residential and commercial pressure cleaning for hard surfaces.",
    description:
      "Remove mould, mildew, dirt, and oil from driveways, patios, walls, and industrial hardstands using EPA-compliant methods.",
    segments: [
      {
        name: "Residential Pressure Cleaning",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Pressure Clean · Up to 25m²",
            description: "Paths, patios, or small courtyards (minimum service).",
            basePrice: 100,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Pressure Clean · Up to 50m²",
            description: "Driveways or entertainment areas.",
            basePrice: 200,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Pressure Clean · Up to 75m²",
            description: "Driveway plus paved areas or retaining walls.",
            basePrice: 300,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Whole Property Exterior",
            description:
              "Comprehensive exterior pressure clean for large homes.",
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Pressure Cleaning",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Shopfront & Entry · Up to 50m²",
            description: "Entrance and frontage clean for retail premises.",
            basePrice: 200,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Car Park / Hardstand · Up to 150m²",
            description: "Degrease and clean commercial hardstands.",
            basePrice: 600,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Warehouse Exterior · Up to 300m²",
            description: "Loading zone and façade cleaning with compliance.",
            basePrice: 1200,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Industrial Site Pressure Clean",
            description: "Custom clean for multi-zone or high-access sites.",
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Oil & Grease Treatment",
        description: "Degreaser application for stubborn driveway stains.",
        price: 40,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "Graffiti Removal",
        description: "Targeted treatment for graffiti on walls or fences.",
        price: 60,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Surface Sealer Application",
        description: "Protective coating for concrete or paver surfaces.",
        price: 80,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Roof or Solar Pressure Wash",
        description: "Low-pressure clean for roofs or solar arrays.",
        price: 149,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Pressure Clean",
        description: "Night or weekend availability for commercial clients.",
        price: 50,
        audience: AudienceType.COMMERCIAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "rubbish-removal",
    name: "Rubbish Removal",
    summary:
      "Fast, eco-friendly waste removal for homes, offices, and construction sites.",
    description:
      "Load-and-go rubbish removal including responsible disposal, recycling, and site sweep for residential, commercial, and building projects.",
    segments: [
      {
        name: "Residential Loads",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Mini Load · ~1m³",
            description: "Small declutter or light furniture removal.",
            basePrice: 149,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Quarter Load · ~2m³",
            description: "Furniture, bags, or garden waste.",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Half Load · ~3m³",
            description: "Apartment or garage clean-out.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Full Load · ~6m³",
            description: "Full home or yard clean-up (up to 500kg).",
            basePrice: 399,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Construction & Renovation",
        type: ServiceSegmentType.INDUSTRIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Construction Waste · 2m³",
            description: "Timber, plasterboard, or light debris.",
            basePrice: 249,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Construction Waste · 4m³",
            description: "Mixed renovation waste sorted and recycled.",
            basePrice: 349,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Construction Waste · 6m³",
            description: "Large renovation or demolition debris removal.",
            basePrice: 499,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Heavy Load · Bricks & Concrete",
            description: "Up to 700kg of heavy waste with safe disposal.",
            basePrice: 599,
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Waste Removal",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 3,
        packages: [
          {
            name: "Commercial Load · Small",
            description: "Boxes, e-waste, or office junk removal.",
            basePrice: 199,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Commercial Load · Medium",
            description: "Desks, shelving, and mixed waste.",
            basePrice: 299,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Commercial Load · Full",
            description: "Large office clean outs including appliances.",
            basePrice: 399,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Warehouse or Multi-Truck",
            description: "On-site quote for large commercial sites.",
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Green Waste Removal",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 4,
        packages: [
          {
            name: "Green Waste · Up to 2m³",
            description: "Grass clippings, leaves, or small branches.",
            basePrice: 149,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Green Waste · Up to 4m³",
            description: "Garden debris and shrub pruning.",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Green Waste · Up to 6m³",
            description: "Full trailer load of green waste removal.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Urgent Same-Day Pickup",
        description: "Priority collection subject to availability.",
        price: 75,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "After-Hours Removal",
        description: "Weekend or early morning rubbish removal service.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Whitegoods Recycling",
        description: "Responsible disposal of fridges, washers, or AC units.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Mattress Disposal",
        description: "Removal and recycling of mattresses.",
        price: 30,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "Tyre Disposal",
        description: "Per tyre disposal fee for passenger vehicles.",
        price: 15,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "solar-panel-cleaning",
    name: "Solar Panel Cleaning",
    summary:
      "Pure water solar panel cleaning to maximise energy output.",
    description:
      "Safe, chemical-free solar panel cleaning with deionised water systems for residential and commercial installations.",
    segments: [
      {
        name: "Residential Solar Cleaning",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Solar Clean · Up to 10 Panels",
            description:
              "Purified-water clean for small home systems (1.5–3kW).",
            basePrice: 99,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Solar Clean · Up to 20 Panels",
            description: "Panels, frames, and glass surfaces cleaned.",
            basePrice: 149,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Solar Clean · Up to 30 Panels",
            description: "Full array clean for larger home systems.",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Solar Clean · Up to 40 Panels",
            description:
              "Comprehensive clean and inspection for 10kW+ systems.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Solar Cleaning",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Solar Clean · Up to 50 Panels",
            description: "Office or warehouse roof-mounted system clean.",
            basePrice: 299,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Solar Clean · Up to 100 Panels",
            description: "Multi-roof or large commercial installations.",
            basePrice: 499,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Industrial Solar Arrays",
            description: "Custom programs for 100+ panel solar farms.",
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 3,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Bird Dropping Treatment",
        description: "Extra agitation for stubborn debris and droppings.",
        price: 40,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "Roof Gutter Flush",
        description: "Clear gutters while on-site during solar clean.",
        price: 60,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Battery Bay Dust Clean",
        description: "Vacuum and wipe solar battery housing.",
        price: 30,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "System Efficiency Test",
        description: "Provide basic output check after cleaning.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Solar Clean",
        description: "Weekend or late-day scheduling.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter Cleaning",
    summary:
      "Safe gutter cleaning to prevent leaks, water damage, and blockages.",
    description:
      "Vacuum and manual gutter cleaning for residential and commercial properties with optional downpipe flushing and gutter guard installation.",
    segments: [
      {
        name: "Residential Gutter Cleaning",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Gutter Clean · Up to 15m",
            description:
              "Unit or single-storey home gutter clean and debris removal.",
            basePrice: 129,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Gutter Clean · Up to 25m",
            description: "Standard 2–3 bedroom home gutter clean.",
            basePrice: 179,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Gutter Clean · Up to 35m",
            description: "Large 4–5 bedroom home including roof valleys.",
            basePrice: 229,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Double-Storey Gutter Clean",
            description: "Two-storey or complex roofs up to 40m of gutters.",
            basePrice: 279,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Gutter Cleaning",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Commercial Roof · Up to 50m",
            description:
              "Office or retail roof gutter clean with waste removal.",
            basePrice: 299,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Warehouse / School · Large Roof",
            description: "Multiple downpipes and large roof areas.",
            basePrice: 399,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Industrial Complex Gutter Clean",
            description:
              "Custom maintenance for industrial or multi-roof sites.",
            audience: AudienceType.INDUSTRIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 3,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Gutter Guard Installation",
        description: "Install gutter guard to prevent future blockages.",
        price: 10,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 1,
        metadata: { unit: "per metre" },
      },
      {
        name: "Roof & Valley Clean",
        description: "Remove leaf build-up from roof valleys.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Downpipe Flush",
        description: "Pressure-flush blocked downpipes.",
        price: 30,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Minor Gutter Repairs",
        description: "Patch leaks or replace small sections.",
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.BY_QUOTE,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Gutter Service",
        description: "Weekend or emergency gutter clearing.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
  {
    slug: "disinfection-sanitisation",
    name: "Disinfection & Sanitisation",
    summary:
      "Hospital-grade disinfection for homes, offices, schools, and workplaces.",
    description:
      "Certified infection-control cleaning with electrostatic fogging, touchpoint sanitising, and rapid response options across residential and commercial properties.",
    segments: [
      {
        name: "Residential Disinfection",
        type: ServiceSegmentType.RESIDENTIAL,
        displayOrder: 1,
        packages: [
          {
            name: "Basic Sanitisation",
            description:
              "Touchpoint clean and light disinfectant mist for small homes.",
            basePrice: 129,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Whole Home Sanitisation",
            description:
              "Full home fogging and wipe-down (2–3 bedroom homes).",
            basePrice: 199,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Deep Disinfection Clean",
            description: "High-risk or large homes requiring deep sanitisation.",
            basePrice: 249,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Post-Illness Clean",
            description: "Specialist clean after illness or exposure.",
            basePrice: 299,
            audience: AudienceType.RESIDENTIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
      {
        name: "Commercial Disinfection",
        type: ServiceSegmentType.COMMERCIAL,
        displayOrder: 2,
        packages: [
          {
            name: "Precautionary Disinfection · Up to 100m²",
            description: "Touchpoint and surface sanitisation for offices or shops.",
            basePrice: 149,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 1,
          },
          {
            name: "Electrostatic Fogging · Up to 250m²",
            description: "Whole-site misting for even coverage.",
            basePrice: 249,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 2,
          },
          {
            name: "Large Facility Disinfection · Up to 500m²",
            description: "High-traffic zones, warehouses, or classrooms.",
            basePrice: 399,
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.PER_JOB,
            priceFrom: true,
            displayOrder: 3,
          },
          {
            name: "Campus or Aged Care Facility",
            description:
              "Custom disinfection for large or multi-site properties.",
            audience: AudienceType.COMMERCIAL,
            priceUnit: PriceUnit.BY_QUOTE,
            priceFrom: true,
            displayOrder: 4,
          },
        ],
      },
    ],
    addOns: [
      {
        name: "Upholstery & Fabric Sanitisation",
        description: "Steam or mist cleaning for couches and chairs.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 1,
      },
      {
        name: "Vehicle Sanitisation",
        description: "Fog and wipe down vehicle interiors.",
        price: 80,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 2,
      },
      {
        name: "Air Conditioning Vent Clean",
        description: "Disinfect and deodorise HVAC vents.",
        price: 40,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_ITEM,
        priceFrom: true,
        displayOrder: 3,
      },
      {
        name: "Odour Neutralisation",
        description: "Remove lingering bacteria-related odours.",
        price: 60,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 4,
      },
      {
        name: "After-Hours Disinfection",
        description: "Schedule outside trading hours or weekends.",
        price: 50,
        audience: AudienceType.UNIVERSAL,
        priceUnit: PriceUnit.PER_JOB,
        priceFrom: true,
        displayOrder: 5,
      },
    ],
  },
];

const membershipPlans = [
  {
    name: "Basic",
    slug: "basic",
    tierLevel: 1,
    minPoints: 0,
    maxPoints: 999,
    discountPercent: 0,
    perks: [
      "Access to all CleenQ services nationwide",
      "Earn 1 point per $1 spent",
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    tierLevel: 2,
    minPoints: 1000,
    maxPoints: 2999,
    discountPercent: 5,
    perks: [
      "5% discount on all services",
      "Priority scheduling window",
      "Bonus offers on bundles",
    ],
  },
  {
    name: "Platinum",
    slug: "platinum",
    tierLevel: 3,
    minPoints: 3000,
    maxPoints: null,
    discountPercent: 10,
    perks: [
      "10% discount on all services",
      "Priority booking and waitlist bump",
      "Complimentary annual deep clean add-on",
    ],
  },
];

async function seedAdmin() {
  const email = "founder@cleenq.com.au";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "CleenQ#2025!";
  const passwordHash = await hashPassword(password);

  await prisma.admin.upsert({
    where: { email },
    update: {
      fullName: "CleenQ Founder",
      role: AdminRole.SUPER_ADMIN,
      status: "ACTIVE",
      passwordHash,
    },
    create: {
      email,
      fullName: "CleenQ Founder",
      role: AdminRole.SUPER_ADMIN,
      status: "ACTIVE",
      passwordHash,
    },
  });
}

async function seedServices() {
  for (const serviceSeed of serviceSeeds) {
    const service = await prisma.serviceCategory.upsert({
      where: { slug: serviceSeed.slug },
      update: {
        name: serviceSeed.name,
        summary: serviceSeed.summary,
        description: serviceSeed.description,
        isActive: true,
      },
      create: {
        slug: serviceSeed.slug,
        name: serviceSeed.name,
        summary: serviceSeed.summary,
        description: serviceSeed.description,
        isActive: true,
      },
    });

    for (const segmentSeed of serviceSeed.segments) {
      const segment = await prisma.serviceSegment.upsert({
        where: {
          serviceCategoryId_name: {
            serviceCategoryId: service.id,
            name: segmentSeed.name,
          },
        },
        update: {
          description: segmentSeed.description,
          type: segmentSeed.type,
          displayOrder: segmentSeed.displayOrder ?? 0,
        },
        create: {
          serviceCategoryId: service.id,
          name: segmentSeed.name,
          description: segmentSeed.description,
          type: segmentSeed.type,
          displayOrder: segmentSeed.displayOrder ?? 0,
        },
      });

      for (const packageSeed of segmentSeed.packages) {
        await prisma.servicePackage.upsert({
          where: {
            serviceCategoryId_segmentId_name: {
              serviceCategoryId: service.id,
              segmentId: segment.id,
              name: packageSeed.name,
            },
          },
          update: {
            description: packageSeed.description,
            audience: packageSeed.audience,
            basePrice: toDecimal(packageSeed.basePrice),
            priceUnit: packageSeed.priceUnit,
            priceFrom: packageSeed.priceFrom ?? true,
            minQuantity: packageSeed.minQuantity,
            maxQuantity: packageSeed.maxQuantity,
            metadata: packageSeed.metadata,
            displayOrder: packageSeed.displayOrder ?? 0,
            isActive: true,
          },
          create: {
            serviceCategoryId: service.id,
            segmentId: segment.id,
            name: packageSeed.name,
            description: packageSeed.description,
            audience: packageSeed.audience,
            basePrice: toDecimal(packageSeed.basePrice),
            priceUnit: packageSeed.priceUnit,
            priceFrom: packageSeed.priceFrom ?? true,
            minQuantity: packageSeed.minQuantity,
            maxQuantity: packageSeed.maxQuantity,
            metadata: packageSeed.metadata,
            displayOrder: packageSeed.displayOrder ?? 0,
            isActive: true,
          },
        });
      }
    }

    for (const addonSeed of serviceSeed.addOns) {
      await prisma.serviceAddon.upsert({
        where: {
          serviceCategoryId_name: {
            serviceCategoryId: service.id,
            name: addonSeed.name,
          },
        },
        update: {
          description: addonSeed.description,
          audience: addonSeed.audience,
          price: toDecimal(addonSeed.price),
          priceUnit: addonSeed.priceUnit,
          priceFrom: addonSeed.priceFrom ?? true,
          metadata: addonSeed.metadata,
          displayOrder: addonSeed.displayOrder ?? 0,
          isActive: true,
        },
        create: {
          serviceCategoryId: service.id,
          name: addonSeed.name,
          description: addonSeed.description,
          audience: addonSeed.audience,
          price: toDecimal(addonSeed.price),
          priceUnit: addonSeed.priceUnit,
          priceFrom: addonSeed.priceFrom ?? true,
          metadata: addonSeed.metadata,
          displayOrder: addonSeed.displayOrder ?? 0,
          isActive: true,
        },
      });
    }
  }
}

async function seedMemberships() {
  for (const plan of membershipPlans) {
    await prisma.membershipPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        tierLevel: plan.tierLevel,
        minPoints: plan.minPoints,
        maxPoints: plan.maxPoints ?? undefined,
        discountPercent: plan.discountPercent,
        perks: plan.perks,
        isActive: true,
      },
      create: {
        name: plan.name,
        slug: plan.slug,
        tierLevel: plan.tierLevel,
        minPoints: plan.minPoints,
        maxPoints: plan.maxPoints ?? undefined,
        discountPercent: plan.discountPercent,
        perks: plan.perks,
        isActive: true,
      },
    });
  }
}

async function seedRewardSettings() {
  await prisma.rewardSetting.upsert({
    where: { id: 1 },
    update: {
      pointsPerDollar: 1,
      redemptionThreshold: 500,
      redemptionValue: new Prisma.Decimal(25),
      note: "Default CleenQ loyalty configuration.",
    },
    create: {
      id: 1,
      pointsPerDollar: 1,
      redemptionThreshold: 500,
      redemptionValue: new Prisma.Decimal(25),
      note: "Default CleenQ loyalty configuration.",
    },
  });
}

async function main() {
  await seedAdmin();
  await seedServices();
  await seedMemberships();
  await seedRewardSettings();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("🌱 Database seed completed");
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });

