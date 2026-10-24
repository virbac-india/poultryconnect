export enum BirdType {
  Broiler = 'Broiler',
  Layer = 'Layer',
}

export type SeasonType = 'Summer / Heat Stress' | 'Monsoon / Wet Litter' | 'Winter / Cold Ammonia' | 'Seasonal Transition';

export interface BroilerBenchmark {
  day: number;
  bw: number; // grams
  fcr: number;
  waterMlPerBird: number; // daily water intake estimate in ml
  phaseLabel: string;
}

export interface LayerBenchmark {
  week: number;
  bw: number; // grams
  feedGramsPerDay: number;
  waterMlPerBird: number;
  targetEggPct: number; // 0 during pullet stage, % during lay
  phaseLabel: string;
}

export interface SeasonalUnderweightReason {
  id: string;
  season: SeasonType;
  title: string;
  pathophysiology: string;
  shedIndicators: string[];
  fieldAction: string;
  consultantReferralTopic: string;
  recommendedProductIds: string[];
  birdTypes: BirdType[];
}

export type DosageBasis = 'per_1000_birds' | 'per_100_birds' | 'per_liter_water' | 'per_ton_feed' | 'per_kg_bw';

export interface ProductSKU {
  code: string;
  packName: string;
  packSizeValue: number;
  packUnit: 'ml' | 'L' | 'gm' | 'kg' | 'doses';
  baseUnits: number; // in ml, gm, or doses
  ptr: number; // Price to Retailer (₹)
  mrp: number; // Maximum Retail Price (₹)
}

export interface ProductItem {
  id: string;
  name: string;
  shortCode: string;
  category:
    | 'Liquid Minerals & Skeletal'
    | 'Liver & Kidney Detox'
    | 'Vitamins & Anti-Stress'
    | 'Energy Boosters'
    | 'Gut Health & Synbiotics'
    | 'Respiratory & Antibiotics'
    | 'Anticoccidial'
    | 'Deworming & Parasiticides'
    | 'Toxin Binders & Premixes'
    | 'Biosecurity & Sanitizers'
    | 'Biologicals & Vaccines';
  positioning: string; // From PDF Visual Aid tagline
  composition: string;
  keyBenefits: string[];
  suggestiveUsage: string;
  dosageBasis: DosageBasis;
  standardDose: number;
  doseUnit: 'ml' | 'gm';
  defaultDays: number;
  skus: ProductSKU[];
  selectedSkuCode?: string;
  birdTypes: BirdType[];
}

export interface SelectedProductPlan {
  productId: string;
  selectedSkuCode: string;
  customDose?: number;
  days: number;
}

export interface CalculatedProductCost {
  product: ProductItem;
  sku: ProductSKU;
  doseRate: number;
  days: number;
  dailyQuantity: number; // ml or gm per day for entire flock
  totalQuantity: number; // ml or gm for full course
  packsNeeded: number;
  packsRounded: number;
  exactUsedCostMrp: number;
  exactUsedCostPtr: number;
  commercialPackCostMrp: number;
  commercialPackCostPtr: number;
  costPerBirdExactMrp: number;
  costPerBirdExactPtr: number;
  costPerBirdCommercialMrp: number;
  costPerBirdCommercialPtr: number;
  costPerBirdPerDay: number;
}

export interface DiseaseEntry {
  id: string;
  name: string;
  aliases: string[];
  etiology: 'Viral' | 'Bacterial' | 'Protozoal' | 'Metabolic & Nutritional' | 'Fungal / Mycotoxin';
  causativeAgent: string;
  affectedBirds: BirdType[];
  severity: 'High' | 'Moderate' | 'Critical';
  symptoms: string[];
  postMortemLesions: string[];
  fieldManagement: string[];
  recommendedProductIds: string[];
}

export interface ActiveFlockSchedule {
  id: string;
  farmName: string;
  farmerName: string;
  farmerPhone: string;
  birdType: BirdType;
  flockSize: number;
  placementDate: string; // YYYY-MM-DD
  completedTaskIds: string[];
}

export interface FarmVisitRecord {
  id: string;
  recordedAt: string; // ISO string with exact date & time
  followUpDueAt: string; // ISO string (+7 days)
  followUpStatus: 'pending' | 'reminded' | 'completed';
  followUpCompletedAt?: string;
  followUpCallNotes?: string;
  autoMailTriggered?: boolean;
  boName?: string;
  boEmail?: string;
  boPhone?: string;
  buUnit?: string;
  region?: string;
  hq?: string;
  officerName: string;
  officerEmail: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  farmerEmail: string;
  villageLocation: string;
  seasonObserved: SeasonType;
  birdType: BirdType;
  flockSize: number;
  ageValue: number; // Day (1-56) for Broiler, Week (1-72) for Layer
  targetBW: number;
  observedBW: number;
  observedEggPct?: number;
  targetEggPct?: number;
  weightStatus: 'optimal' | 'underweight';
  weightDeficitGrams: number;
  extraFeedFlockKg: number;
  selectedReasonIds: string[];
  // Layer-Specific Metrics & Economics
  eggPricePerUnit?: number; // e.g. ₹5.50 / egg
  targetEggCount?: number; // Target daily eggs for flock
  observedEggCount?: number; // Observed daily eggs for flock
  dailyEggDeficit?: number; // Lost eggs per day
  dailyFinancialLoss?: number; // ₹ lost per day
  monthlyFinancialLoss?: number; // ₹ lost per month
  selectedLayerIssueIds?: string[]; // IDs of observed layer issues
  consultantReferred: boolean;
  consultantReferralNotes?: string;
  diagnosedDiseaseIds: string[];
  selectedProducts: {
    productId: string;
    productName: string;
    skuCode: string;
    packName: string;
    doseRate: number;
    doseUnit: 'ml' | 'gm';
    dosageBasis: DosageBasis;
    days: number;
    totalQuantity: number;
    packsRounded: number;
    mrpPerPack: number;
    ptrPerPack: number;
    totalPackCostMrp: number;
    costPerBird: number;
  }[];
  totalPrescriptionCost: number;
  totalCostPerBird: number;
  fieldNotes: string;
}

export interface OfficerProfile {
  officerName: string; // BO (Business Officer) Name
  officerEmail: string; // Follow-Up Email for Sales Officer to receive reminders
  officerPhone: string;
  buUnit: string; // BU Unit (e.g. Poultry BU)
  region: string; // Region (e.g. South, North, West, East)
  hq: string; // HQ (e.g. Namakkal, Hyderabad, Karnal, Pune)
  territory: string;
  currencySymbol: string;
  autoTriggerMailtoOnDue: boolean;
  web3FormsKey: string;
  consultantName: string;
  consultantPhone: string;
  consultantEmail: string;
  isAuthorized?: boolean;
}
