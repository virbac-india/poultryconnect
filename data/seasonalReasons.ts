import { BirdType, SeasonalUnderweightReason, SeasonType } from '../types/poultry';

export const SEASONAL_UNDERWEIGHT_REASONS: SeasonalUnderweightReason[] = [
  // SUMMER / HEAT STRESS (MARCH TO JUNE)
  {
    id: 'rsn-summer-panting',
    season: 'Summer / Heat Stress',
    title: 'Thermal Alkalosis & Depressed Daytime Feed Intake',
    pathophysiology:
      'Ambient shed temperatures exceeding 32°C force birds into heavy evaporative panting. Rapid CO2 exhalation causes respiratory alkalosis and blood bicarbonate depletion. Daytime feed intake plummets by 20–35% while birds expend critical metabolic energy trying to cool down.',
    shedIndicators: [
      'Open-mouth panting with wings held dropped away from body',
      'Sudden jump in water-to-feed ratio (drinking 3x to 4x normal volume)',
      'Watery, loose droppings from excessive water flushing',
      'Late-afternoon bird lethargy and prostration',
    ],
    fieldAction:
      'Advise farmer to lift feed pans during peak heat (11:00 AM – 4:00 PM) and provide full feed in cool evening/early morning hours. Acidify water and restore electrolyte balance.',
    consultantReferralTopic:
      'Request Poultry Consultant to audit roof insulation, sprinkler/fogger cycle timing, and recommend dietary fat vs carbohydrate energy restructuring.',
    recommendedProductIds: ['prd-vimeral', 'prd-calgophos', 'prd-anabolite'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-summer-pipeline-heat',
    season: 'Summer / Heat Stress',
    title: 'Hot Pipeline Drinking Water & Bacterial Biofilm Surge',
    pathophysiology:
      'Overhead tanks and black PVC water pipes heated by the sun deliver warm water (>30°C) to nipple lines. Birds refuse warm water or consume bacteria-laden water, leading to subclinical E. coli proliferation and impaired gut villi nutrient absorption.',
    shedIndicators: [
      'Warm or hot water flowing from nipple drinkers',
      'Chicks or pullets crowding under drinkers but refusing to drink freely',
      'Subclinical colibacillosis with pericardial turbidity on necropsy',
    ],
    fieldAction:
      'Cover overhead water tanks with wet gunny bags, flush pipeline ends twice daily, and sanitize drinking lines with Sokrena W.S.',
    consultantReferralTopic:
      'Request Poultry Consultant to perform water microbiology test (CFU/ml & TDS/pH) and evaluate pipeline cooling flow rate.',
    recommendedProductIds: ['prd-kohrsolin', 'prd-addon-max', 'prd-brotone'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-summer-mineral-loss',
    season: 'Summer / Heat Stress',
    title: 'Mineral & Electrolyte Depletion / Thin Eggshells',
    pathophysiology:
      'Respiratory alkalosis lowers ionized blood calcium and phosphorus availability for bone and shell mineralization, causing severe keel bone softening, lameness in broilers, and sudden thin-shelled or cracked eggs in layers.',
    shedIndicators: [
      'Thin, cracked, corrugated or shell-less eggs in layer cages',
      'Lameness, birds resting on hocks, unable to walk to feed pans',
      'Soft, pliable rubbery beaks and keel bones in young stock',
    ],
    fieldAction:
      'Administer Calgophos (8 liquid acidic minerals) in drinking water to bypass alkaline gut and replenish Phosphorus, Calcium, and Magnesium.',
    consultantReferralTopic:
      'Request Poultry Consultant to review dietary limestone grit particle size (2–4 mm coarse grit) and pre-lay medullary bone mineralization program.',
    recommendedProductIds: ['prd-calgophos', 'prd-kalzol', 'prd-vimeral'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },

  // MONSOON / WET LITTER (JULY TO SEPTEMBER)
  {
    id: 'rsn-monsoon-coccidiosis',
    season: 'Monsoon / Wet Litter',
    title: 'Wet Litter Sporulation Surge & Subclinical Coccidiosis',
    pathophysiology:
      'High ambient relative humidity (>80%) combined with moist litter creates perfect conditions for Eimeria oocyst sporulation. Even subclinical caecal (E. tenella) and intestinal (E. acervulina, E. maxima) damage blunts intestinal villi, severely disrupting protein synthesis and weight gain.',
    shedIndicators: [
      'Wet, caked, slippery litter along drinker lines',
      'Orange mucoid or bloody flecks in droppings',
      'Flock unevenness, pale combs, and depigmented shanks',
    ],
    fieldAction:
      'Rake wet caked litter, treat immediately with Amprolium Powder, and repair leaking nipples. Follow with Vitablend WMF to regenerate gut mucosal epithelium.',
    consultantReferralTopic:
      'Request Poultry Consultant to perform gut scraping lesion scoring (Johnson & Reid scale) and review anticoccidial shuttle/rotation program.',
    recommendedProductIds: ['prd-amprolium', 'prd-vitablend', 'prd-addon-max'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-monsoon-mycotoxin',
    season: 'Monsoon / Wet Litter',
    title: 'Damp Feed Storage & Multiple Mycotoxicosis (Aflatoxin / Ochratoxin)',
    pathophysiology:
      'Moist monsoon maize and groundnut cake harbor Aspergillus and Fusarium moulds. Toxins (Aflatoxin B1, Ochratoxin A, T-2) cause bile duct proliferation, fatty hepatic degeneration, and kidney enlargement, resulting in feed passage and immunity failure.',
    shedIndicators: [
      'Caked mouldy feed in feed pan corners or silo boots',
      'Yellowish-tan enlarged friable liver or pale swollen kidneys on necropsy',
      'Undigested whole grains in droppings ("feed passage syndrome")',
      'Poor vaccine antibody titers despite timely vaccination',
    ],
    fieldAction:
      'Discard mouldy caked feed, add Toximar Forte (1.5–2 kg/ton of feed) to bind toxins, and run Brotone Vet (25x liver extract) to rejuvenate hepatocytes.',
    consultantReferralTopic:
      'Request Poultry Consultant to run feed sample ELISA mycotoxin test (ppb levels of Aflatoxin/Ochratoxin) and inspect grain moisture percentage.',
    recommendedProductIds: ['prd-toximar', 'prd-brotone', 'prd-hepono'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-monsoon-enteritis',
    season: 'Monsoon / Wet Litter',
    title: 'Gut Dysbacteriosis & Clostridial Necrotic Enteritis',
    pathophysiology:
      'High humidity and mucosal damage trigger Clostridium perfringens proliferation. Bacterial alpha and NetB toxins create a pseudomembrane on the jejunum and ileum, severely depressing body weight and causing acute mortality in good-conditioned birds.',
    shedIndicators: [
      'Foul-smelling, gas-filled, brownish-orange droppings',
      'Gas-ballooned intestines with "Turkish towel" appearance on post-mortem',
      'Sudden mortality spike in heaviest broilers around Day 18–28',
    ],
    fieldAction:
      'Administer Addon Poultry Max (5 Billion CFU synbiotic) in feed to competitively exclude Clostridia and restore gut barrier integrity.',
    consultantReferralTopic:
      'Request Poultry Consultant to inspect wheat/maize NSP viscosity and check fishmeal/SBM quality parameters.',
    recommendedProductIds: ['prd-addon-max', 'prd-vitablend', 'prd-brotone'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },

  // WINTER / COLD AMMONIA (NOVEMBER TO FEBRUARY)
  {
    id: 'rsn-winter-ammonia',
    season: 'Winter / Cold Ammonia',
    title: 'Sealed Curtains, Ammonia (>20 ppm) & Chronic Respiratory Disease',
    pathophysiology:
      'To conserve warmth, farmers seal shed curtains completely. Wet litter releases toxic ammonia gas (>20 ppm), paralyzing the tracheal cilia. Airborne dust and Mycoplasma gallisepticum easily invade the respiratory tract, causing airsacculitis and chronic feed refusal.',
    shedIndicators: [
      'Strong eye-stinging ammonia smell upon entering shed at sunrise',
      'Night-time snicking, sneezing, tracheal rales and swollen facial sinuses',
      'Foamy or cloudy caseous exudate in thoracic and abdominal air sacs',
    ],
    fieldAction:
      'Establish minimum ceiling ridge ventilation to vent ammonia without creating draft chills on bird floor. Administer Trox (50% Tylosin Tartrate) which concentrates 20x higher in air sacs than blood.',
    consultantReferralTopic:
      'Request Poultry Consultant to evaluate minimum ventilation cubic-feet-per-minute (CFM/kg) and smoke-test shed airflow patterns.',
    recommendedProductIds: ['prd-trox', 'prd-lixen-pwd', 'prd-vitagro'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-winter-brooding-chill',
    season: 'Winter / Cold Ammonia',
    title: 'Early Brooding Floor Chilling & Retained Yolk Sac',
    pathophysiology:
      'Floor temperature below 32°C during Days 1–3 causes chick hypothermia. Chicks huddle near brooders instead of feeding, and unabsorbed cold yolk sacs become infected with E. coli, stalling 7-day target weight (which dictates 42-day final slaughter weight).',
    shedIndicators: [
      'Chicks huddling tightly under brooder hoods or in ring corners',
      'Unabsorbed, congested, foul-smelling yolk sacs in chicks >5 days',
      'Day 7 average chick weight below 180–200g benchmark',
    ],
    fieldAction:
      'Pre-heat shed 24 hours prior to chick placement (32–33°C litter temperature). Provide Anabolite - P (Metabolite MIX) for immediate gluconeogenic energy and rapid yolk absorption.',
    consultantReferralTopic:
      'Request Poultry Consultant to check chick vent temperatures (103–104°F) and crop fill percentage (target >95% full at 24h post-placement).',
    recommendedProductIds: ['prd-anabolite', 'prd-lixen-pwd', 'prd-vimeral'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
  {
    id: 'rsn-winter-ascites-gout',
    season: 'Winter / Cold Ammonia',
    title: 'Pulmonary Hypertension (Ascites) & Baby Chick Urolithiasis (Gout)',
    pathophysiology:
      'Cold stress accelerates bird metabolic rate. Fast-growing broilers require high oxygen, forcing the right heart ventricle to hypertrophy. Fluid backs up into the abdomen (water belly). Concurrently, reduced cold water intake causes uric acid crystal deposition in kidneys and pericardium.',
    shedIndicators: [
      'Broilers standing in "penguin posture" with distended fluid-filled abdomen',
      'Cyanotic (bluish-purple) combs and wattles',
      'Chalky white uric acid frosting on heart, liver and swollen kidneys',
    ],
    fieldAction:
      'Slightly warm drinking water to encourage water consumption. Administer Hepono Mix to flush kidneys and relieve hepatic congestion.',
    consultantReferralTopic:
      'Request Poultry Consultant to review nighttime temperature drops and broiler lighting/growth curve moderation program.',
    recommendedProductIds: ['prd-hepono', 'prd-calgophos', 'prd-brotone'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },

  // SEASONAL TRANSITION / VARIABLE WEATHER
  {
    id: 'rsn-transition-diurnal',
    season: 'Seasonal Transition',
    title: 'Wide Diurnal Temperature Swings (>12°C Delta)',
    pathophysiology:
      'Hot afternoons followed by cold, windy nights subject the flock to rapid thermal shocks. Immune cortisol spikes suppress antibody production and disrupt feed conversion.',
    shedIndicators: [
      'Day-night temperature variation exceeding 10–12°C',
      'Flock growth CV widening (>12%), with increasing runt/stunted birds',
      'Mild post-vaccination respiratory snicking',
    ],
    fieldAction:
      'Adjust side curtains gradually twice a day. Provide Vimeral Forte + Groviplex to support nervous stability and maintain normal feed intake.',
    consultantReferralTopic:
      'Request Poultry Consultant to review shed curtain automation, sensor placement, and seasonal transition feeding schedules.',
    recommendedProductIds: ['prd-vimeral', 'prd-groviplex', 'prd-vitablend'],
    birdTypes: [BirdType.Broiler, BirdType.Layer],
  },
];
