import { ProductItem } from '../types/poultry';

export interface LayerHealthIssue {
  id: string;
  title: string;
  subtitle: string;
  category: 'Eggshell Quality' | 'Production Slump' | 'Skeletal & Locomotion' | 'Metabolic & Liver' | 'Parasitic & Behavioral';
  primaryCause: string;
  symptoms: string[];
  economicImpact: string;
  recommendedProductIds: string[];
  recommendedAdvice: string;
}

export const LAYER_SPECIFIC_ISSUES: LayerHealthIssue[] = [
  {
    id: 'layer-thin-cracked-shells',
    title: 'Thin-Shelled, Hairline Cracked & Fragile Eggs',
    subtitle: 'High collection breakages, translucent pinpoint spots, weak eggshell apex',
    category: 'Eggshell Quality',
    primaryCause: 'Calcium-Phosphorus imbalance, metabolic alkalosis during warm weather, or depletion of medullary bone calcium reserves',
    symptoms: [
      'High egg breakage percentage (>3-5%) during collection and grading trays',
      'Hairline cracks and sandpaper or corrugated rough eggshell texture',
      'Pale, translucent pinpoint areas on egg candling',
    ],
    economicImpact: 'Every 1% egg breakage in 10,000 birds equals 100 unsellable eggs/day (~₹550-600/day direct loss).',
    recommendedProductIds: ['prd-calgophos', 'prd-kalzol'],
    recommendedAdvice: 'Administer Calgophos (acidic liquid phosphorus + calcium + 6 trace minerals) at 20-40 ml/100 birds for 3 consecutive days to rapidly restore shell calcification.',
  },
  {
    id: 'layer-soft-shell-less',
    title: 'Soft-Shelled & Shell-Less (Membrane-Only) Eggs',
    subtitle: 'Eggs dropped on cage floor / droppings pit without calcified shell',
    category: 'Eggshell Quality',
    primaryCause: 'Uterine shell gland dysfunction, acute Vitamin D3/Calcium malabsorption, or Newcastle/IB viral insult to shell gland',
    symptoms: [
      'Rubbery soft eggs or membrane-only eggs found under cage wire or in manure belt',
      'Premature oviposition of eggs before 20-hour calcification cycle is complete',
      'Hens show transient trembling or reluctance to stand during egg expulsion',
    ],
    economicImpact: 'Direct complete loss of egg yield; soft eggs crack and soil egg collection belts.',
    recommendedProductIds: ['prd-calgophos', 'prd-vitablend'],
    recommendedAdvice: 'Administer Calgophos (2 ml/L) + Vitablend WMF (1 Lac IU/ml Vitamin A + D3 palmitate) for 4 days to rejuvenate shell gland epithelium.',
  },
  {
    id: 'layer-sudden-lay-drop',
    title: 'Sudden Hen-Day Production Drop (5–15% Plunge)',
    subtitle: 'Flock fails to achieve peak lay or abruptly loses persistency',
    category: 'Production Slump',
    primaryCause: 'Feed mycotoxins (Aflatoxin B1 / Ochratoxin A), sudden heat wave, feed formula shift, or subclinical gut challenge',
    symptoms: [
      'Hen-day egg production drops 5-15% below breed benchmark within 48-72 hours',
      'Feed intake slumps by 5-10 g per hen per day',
      'Pale or shrunken combs and wattles across the shed',
    ],
    economicImpact: 'A 10% drop on a 10,000 bird layer unit loses 1,000 eggs/day = ₹5,500/day (₹1,65,000/month loss).',
    recommendedProductIds: ['prd-toximar', 'prd-vimeral', 'prd-groblend'],
    recommendedAdvice: 'Incorporate Toximar Forte at 1.5-2.0 kg/ton of feed immediately to neutralize mycotoxins, and provide Vimeral Forte (15 ml/100 birds) for 5 days as metabolic booster.',
  },
  {
    id: 'layer-cage-layer-fatigue',
    title: 'Cage Layer Fatigue & Osteomalacia (Laying Paralysis)',
    subtitle: 'High-producing birds unable to stand in cages; brittle, soft keel bones',
    category: 'Skeletal & Locomotion',
    primaryCause: 'Exhaustion of cortical bone calcium during prolonged 90%+ peak production without adequate acidic mineral replacement',
    symptoms: [
      'Birds resting on side or hocks in cages, unable to reach feeder and waterer nipples',
      'Pliable, curved keel bone (rubber keel) and easily fractured femurs',
      'High mortality if birds are left in cages without immediate mineral therapy',
    ],
    economicImpact: 'Severe culling of top producing birds (1-2% flock depletion) and permanent production loss.',
    recommendedProductIds: ['prd-calgophos', 'prd-kalzol'],
    recommendedAdvice: 'Administer Calgophos at 40 ml/100 birds in morning drinking water for 3 days and blend Kalzol Forte (1.5 kg/ton) in feed.',
  },
  {
    id: 'layer-flhs',
    title: 'Fatty Liver Hemorrhagic Syndrome (FLHS)',
    subtitle: 'Sudden mortality in heavy laying hens with ruptured liver hematoma',
    category: 'Metabolic & Liver',
    primaryCause: 'Excess caloric intake relative to low exercise in cages, sub-optimal lipotropic factor (Choline, Betaine, B12) levels',
    symptoms: [
      'Sudden death of heavy, active layers in good production with blanched white combs',
      'Autopsy reveals enlarged, pale yellow, friable, greasy liver with massive subcapsular blood clots',
      'Excessive abdominal and visceral retroperitoneal fat pad accumulation',
    ],
    economicImpact: 'Daily mortality of 0.1-0.2% in prime peak laying weeks; loss of birds at maximum asset value.',
    recommendedProductIds: ['prd-brotone', 'prd-hepono'],
    recommendedAdvice: 'Administer Brotone Vet (20 ml/100 birds) daily for 7 days with Hepono Mix to enhance hepatic lipid oxidation and regenerate hepatocytes.',
  },
  {
    id: 'layer-pale-yolks-albumen',
    title: 'Pale Discolored Yolks & Watery Albumen',
    subtitle: 'Egg consumer complaints regarding pale yellow yolks and runny whites',
    category: 'Eggshell Quality',
    primaryCause: 'Impaired intestinal absorption of carotenoids/pigments, sluggish liver bile secretion, or chronic subclinical enteritis',
    symptoms: [
      'Roche Yolk Color Fan score below 8 (very pale yellow yolk instead of golden yellow/orange)',
      'Watery thin albumen with low Haugh unit scores; yolk flattens easily on breaking',
      'Farmer receives trade price deductions from wholesale egg merchants',
    ],
    economicImpact: 'Egg discount of ₹0.30 - ₹0.50 per egg by wholesale traders due to poor customer preference.',
    recommendedProductIds: ['prd-brotone', 'prd-addon'],
    recommendedAdvice: 'Prescribe Brotone Vet (20 ml/100 birds) to stimulate bile secretion and Addon Poultry Max (150 g/ton) to heal intestinal microvilli.',
  },
  {
    id: 'layer-prolapse-cannibalism',
    title: 'Vent Pecking, Prolapse & Cannibalism',
    subtitle: 'Hens pecking exposed cloaca, vent trauma, evisceration mortality',
    category: 'Parasitic & Behavioral',
    primaryCause: 'Mineral and salt deficiency, excessive light intensity, laying oversized double-yolked eggs causing vent straining',
    symptoms: [
      'Blood-stained eggshells and bloody feathers around cloacal vent',
      'Hens aggressively pecking at pen mates with prolapsed oviduct',
      'Sudden spikes in cage mortality due to evisceration',
    ],
    economicImpact: 'Flock depletion of 0.5-1.5% with stress-induced lay drops.',
    recommendedProductIds: ['prd-calgophos', 'prd-vimeral'],
    recommendedAdvice: 'Provide Calgophos (25 ml/100 birds) for 3 days to satiate mineral hunger, and Vimeral Forte (15 ml/100 birds) as neuro-soothing antistress.',
  },
  {
    id: 'layer-red-mites-lice',
    title: 'Red Mites (Dermanyssus gallinae) & Poultry Lice',
    subtitle: 'Nocturnal blood-feeding mites hiding in cage joints; anemia & night restlessness',
    category: 'Parasitic & Behavioral',
    primaryCause: 'External parasite introduction from egg trays, wild birds, or carry-over from previous flock in shed crevices',
    symptoms: [
      'Pale combs, wattles, and mucous membranes (severe blood loss anemia)',
      'Pinpoint black or red spots on eggshells from crushed engorged mites',
      'Flock restlessness at night, continuous preening and skin irritation',
      'Mite clusters visible in cage wires, feeder brackets, and wood supports',
    ],
    economicImpact: 'Persistent 4-8% lay drop, increased feed intake to compensate for anemia, egg downgrades from blood smears.',
    recommendedProductIds: ['prd-virtraz', 'prd-hitek'],
    recommendedAdvice: 'Thoroughly spray shed and cage crevices with Virtraz (5 ml/L water) in late afternoon, and dose birds with Hitek Oral Solution P (1 ml/4 kg BW) in morning water.',
  },
  {
    id: 'layer-internal-worms',
    title: 'Intestinal Worm Infestation (Ascaridia & Cecal Worms)',
    subtitle: 'Nematodes competing for dietary protein and minerals in layer gut',
    category: 'Parasitic & Behavioral',
    primaryCause: 'Delayed or irregular deworming schedule during pullet development and layer production',
    symptoms: [
      'Gradual weight loss or failure to sustain peak egg production',
      'Uneven flock appearance, pale combs, and loose droppings with visible worm segments',
      'Elevated FCR (hens eat normal or extra feed but produce fewer eggs)',
    ],
    economicImpact: 'Waste of 3-5 g feed per bird per day with 2-4% sub-optimal egg production.',
    recommendedProductIds: ['prd-albomar', 'prd-brotone'],
    recommendedAdvice: 'Deworm flock with Albomar Powder (500 gm / 1500 birds) in morning drinking water for 1 day, followed by Brotone Vet for 3 days.',
  },
  {
    id: 'layer-curled-toe-b-complex',
    title: 'B-Complex Deficiency & Leg Weakness in Heavy Lay',
    subtitle: 'Inward curling of toes, polyneuritis, appetite suppression during peak output',
    category: 'Skeletal & Locomotion',
    primaryCause: 'High metabolic vitamin depletion during continuous egg laying not matched by base mash formulation',
    symptoms: [
      'Hens resting on hocks with inward curled toes (curled-toe paralysis)',
      'Suppressed appetite and gradual decline in weekly egg size (weight)',
      'Slow feather regeneration after partial moult',
    ],
    economicImpact: 'Production drop and delayed return to lay in affected cage rows.',
    recommendedProductIds: ['prd-groviplex', 'prd-vitagro'],
    recommendedAdvice: 'Administer Groviplex Powder (100 gm dissolved in water for 1000 birds) for 5-7 days to replenish Vitamin B1, B2, B6, B12, Lysine, and Choline.',
  },
];
