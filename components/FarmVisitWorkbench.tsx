import React, { useMemo, useState } from 'react';
import {
  Award,
  AlertTriangle,
  Check,
  Printer,
  Save,
  Search,
  Share2,
  RotateCcw,
  Stethoscope,
  PhoneCall,
  Info,
  Calendar,
  CloudSun,
} from 'lucide-react';
import { BROILER_STD_DATA, LAYER_STD_DATA } from '../data/nrcBenchmarks';
import { SEASONAL_UNDERWEIGHT_REASONS } from '../data/seasonalReasons';
import { LAYER_SPECIFIC_ISSUES } from '../data/layerIssues';
import { PrintFarmerReportModal } from './PrintFarmerReportModal';
import {
  BirdType,
  FarmVisitRecord,
  OfficerProfile,
  ProductItem,
  ProductSKU,
  SeasonType,
  SelectedProductPlan,
} from '../types/poultry';
import {
  analyzeBodyWeight,
  buildConsultantReferralMessage,
  calculateProductDosageAndCost,
  downloadFollowUpCalendarICS,
  formatQuantity,
  getCurrentSeason,
} from '../utils/calculations';

interface FarmVisitWorkbenchProps {
  products: ProductItem[];
  officerProfile: OfficerProfile;
  preselectedProductIds: string[];
  preselectedDiseaseIds: string[];
  onClearPreselected: () => void;
  onSaveVisit: (visit: FarmVisitRecord) => void;
  onNavigateToFollowUps: () => void;
}

function toLocalDateTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export const FarmVisitWorkbench: React.FC<FarmVisitWorkbenchProps> = ({
  products,
  officerProfile,
  preselectedProductIds,
  preselectedDiseaseIds,
  onClearPreselected,
  onSaveVisit,
  onNavigateToFollowUps,
}) => {
  // Farm & Customer Details
  const [visitDateTime, setVisitDateTime] = useState<string>(() =>
    toLocalDateTimeInputValue(new Date())
  );
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmName, setFarmName] = useState<string>('');
  const [farmerPhone, setFarmerPhone] = useState<string>('');
  const [farmerEmail, setFarmerEmail] = useState<string>('');
  const [villageLocation, setVillageLocation] = useState<string>('');

  // Season & Flock Parameters
  const [seasonObserved, setSeasonObserved] = useState<SeasonType>(getCurrentSeason());
  const [birdType, setBirdType] = useState<BirdType>(BirdType.Broiler);
  const [ageValue, setAgeValue] = useState<number>(21);
  const [observedBW, setObservedBW] = useState<number>(820);
  const [flockSize, setFlockSize] = useState<number>(10000);
  const [observedEggPct, setObservedEggPct] = useState<number>(85);
  const [eggPricePerUnit, setEggPricePerUnit] = useState<number>(5.50);
  const [selectedLayerIssueIds, setSelectedLayerIssueIds] = useState<string[]>(['layer-thin-cracked-shells']);
  const [customWaterMl, setCustomWaterMl] = useState<string>('');

  // Seasonal Underweight Root-Causes & Consultant Referral
  const [selectedReasonIds, setSelectedReasonIds] = useState<string[]>([]);
  const [consultantReferred, setConsultantReferred] = useState<boolean>(false);
  const [consultantNotes, setConsultantNotes] = useState<string>('');
  const [showConsultantCard, setShowConsultantCard] = useState<boolean>(false);

  // Pricing Mode Toggle: MRP vs PTR (Price to Retailer)
  const [pricingMode, setPricingMode] = useState<'mrp' | 'ptr'>('mrp');

  // Selected Products with exact SKU Codes from CSV
  const [selectedPlans, setSelectedPlans] = useState<Record<string, SelectedProductPlan>>(() => {
    const initial: Record<string, SelectedProductPlan> = {
      'prd-calgophos': { productId: 'prd-calgophos', selectedSkuCode: 'AE94489', days: 3 }, // 5L
      'prd-brotone': { productId: 'prd-brotone', selectedSkuCode: 'AE96299', days: 5 }, // 5L
      'prd-vimeral': { productId: 'prd-vimeral', selectedSkuCode: 'AE93889', days: 5 }, // Vimeral Forte 5L
    };
    return initial;
  });

  // Handle incoming preselected products from Diagnostic Tool
  React.useEffect(() => {
    if (preselectedProductIds.length > 0) {
      setSelectedPlans((prev) => {
        const next = { ...prev };
        preselectedProductIds.forEach((id) => {
          const found = products.find((p) => p.id === id);
          if (found && !next[id]) {
            next[id] = {
              productId: id,
              selectedSkuCode: found.skus[0]?.code || '',
              days: found.defaultDays,
            };
          }
        });
        return next;
      });
      onClearPreselected();
    }
  }, [preselectedProductIds, products, onClearPreselected]);

  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [lastSavedVisit, setLastSavedVisit] = useState<FarmVisitRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Switch bird type cleanly
  const handleBirdTypeChange = (type: BirdType) => {
    setBirdType(type);
    if (type === BirdType.Broiler) {
      setAgeValue(21);
      setObservedBW(840);
      setSelectedPlans({
        'prd-calgophos': { productId: 'prd-calgophos', selectedSkuCode: 'AE94489', days: 3 },
        'prd-brotone': { productId: 'prd-brotone', selectedSkuCode: 'AE96299', days: 5 },
        'prd-vimeral': { productId: 'prd-vimeral', selectedSkuCode: 'AE93889', days: 5 },
      });
    } else {
      setAgeValue(26);
      setObservedBW(1560);
      setObservedEggPct(84);
      setSelectedPlans({
        'prd-calgophos': { productId: 'prd-calgophos', selectedSkuCode: 'AE94489', days: 3 },
        'prd-kalzol': { productId: 'prd-kalzol', selectedSkuCode: 'AE96869', days: 5 },
        'prd-vitablend': { productId: 'prd-vitablend', selectedSkuCode: 'AL93889', days: 4 },
      });
    }
    setCustomWaterMl('');
  };

  // Standard Body Weight Analysis
  const bwAnalysis = useMemo(
    () => analyzeBodyWeight(birdType, ageValue, observedBW, flockSize),
    [birdType, ageValue, observedBW, flockSize]
  );

  // Layer-Specific Hen-Day Lay and Financial Loss Calculations
  const targetEggPct = useMemo(() => {
    if (birdType !== BirdType.Layer) return 0;
    return LAYER_STD_DATA[ageValue]?.targetEggPct || 0;
  }, [birdType, ageValue]);

  const isLayingPhase = birdType === BirdType.Layer && ageValue >= 18 && targetEggPct > 0;

  const targetDailyEggs = useMemo(() => {
    if (!isLayingPhase) return 0;
    return Math.round((flockSize * targetEggPct) / 100);
  }, [isLayingPhase, flockSize, targetEggPct]);

  const observedDailyEggs = useMemo(() => {
    if (!isLayingPhase) return 0;
    return Math.round((flockSize * observedEggPct) / 100);
  }, [isLayingPhase, flockSize, observedEggPct]);

  const dailyEggDeficit = useMemo(() => {
    if (!isLayingPhase) return 0;
    return Math.max(0, targetDailyEggs - observedDailyEggs);
  }, [isLayingPhase, targetDailyEggs, observedDailyEggs]);

  const eggDeficitPct = useMemo(() => {
    if (!isLayingPhase) return 0;
    return Math.max(0, targetEggPct - observedEggPct);
  }, [isLayingPhase, targetEggPct, observedEggPct]);

  const dailyFinancialLoss = useMemo(() => {
    if (!isLayingPhase) return 0;
    return Math.round(dailyEggDeficit * eggPricePerUnit);
  }, [isLayingPhase, dailyEggDeficit, eggPricePerUnit]);

  const monthlyFinancialLoss = useMemo(() => {
    return dailyFinancialLoss * 30;
  }, [dailyFinancialLoss]);

  const isLayerProductionOptimal = useMemo(() => {
    if (!isLayingPhase) return bwAnalysis.isOptimalOrAbove;
    return observedEggPct >= targetEggPct;
  }, [isLayingPhase, bwAnalysis.isOptimalOrAbove, observedEggPct, targetEggPct]);

  const toggleLayerIssue = (issueId: string) => {
    setSelectedLayerIssueIds((prev) => {
      const exists = prev.includes(issueId);
      if (exists) {
        return prev.filter((id) => id !== issueId);
      } else {
        const next = [...prev, issueId];
        const issue = LAYER_SPECIFIC_ISSUES.find((i) => i.id === issueId);
        if (issue && issue.recommendedProductIds.length > 0) {
          setSelectedPlans((prevPlans) => {
            const updated = { ...prevPlans };
            issue.recommendedProductIds.forEach((pid) => {
              const prod = products.find((p) => p.id === pid);
              if (prod && !updated[pid]) {
                updated[pid] = {
                  productId: pid,
                  selectedSkuCode: prod.skus[0]?.code || '',
                  days: prod.defaultDays,
                };
              }
            });
            return updated;
          });
        }
        return next;
      }
    });
  };

  const handleAddIssueProducts = (pids: string[]) => {
    setSelectedPlans((prevPlans) => {
      const updated = { ...prevPlans };
      pids.forEach((pid) => {
        const prod = products.find((p) => p.id === pid);
        if (prod && !updated[pid]) {
          updated[pid] = {
            productId: pid,
            selectedSkuCode: prod.skus[0]?.code || '',
            days: prod.defaultDays,
          };
        }
      });
      return updated;
    });
  };

  const effectiveWaterMlPerBird =
    customWaterMl.trim() !== '' && Number(customWaterMl) > 0
      ? Number(customWaterMl)
      : bwAnalysis.waterMlPerBird;

  // Seasonal reasons matching current season and bird type
  const activeSeasonalReasons = useMemo(() => {
    return SEASONAL_UNDERWEIGHT_REASONS.filter(
      (r) => r.season === seasonObserved && r.birdTypes.includes(birdType)
    );
  }, [seasonObserved, birdType]);

  // Product Calculations with exact SKUs from CSV
  const calculatedSelectedProducts = useMemo(() => {
    return (Object.values(selectedPlans) as SelectedProductPlan[])
      .map((plan) => {
        const prod = products.find((p) => p.id === plan.productId);
        if (!prod) return null;
        return calculateProductDosageAndCost(prod, plan, flockSize, effectiveWaterMlPerBird);
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [selectedPlans, products, flockSize, effectiveWaterMlPerBird]);

  const totalExactCost = useMemo(() => {
    return calculatedSelectedProducts.reduce(
      (acc, item) => acc + (pricingMode === 'mrp' ? item.exactUsedCostMrp : item.exactUsedCostPtr),
      0
    );
  }, [calculatedSelectedProducts, pricingMode]);

  const totalCommercialPackCost = useMemo(() => {
    return calculatedSelectedProducts.reduce(
      (acc, item) =>
        acc + (pricingMode === 'mrp' ? item.commercialPackCostMrp : item.commercialPackCostPtr),
      0
    );
  }, [calculatedSelectedProducts, pricingMode]);

  const totalCostPerBirdExact = flockSize > 0 ? totalExactCost / flockSize : 0;
  const totalCostPerBirdPack = flockSize > 0 ? totalCommercialPackCost / flockSize : 0;

  const productCategories = useMemo(() => {
    const set = new Set<string>(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredCatalog = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
      const q = productSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q) ||
        p.positioning.toLowerCase().includes(q) ||
        p.shortCode.toLowerCase().includes(q) ||
        p.skus.some((s) => s.code.toLowerCase().includes(q) || s.packName.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [products, productCategoryFilter, productSearch]);

  const toggleReason = (id: string) => {
    setSelectedReasonIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleProduct = (product: ProductItem) => {
    setSelectedPlans((prev) => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = {
          productId: product.id,
          selectedSkuCode: product.skus[0]?.code || '',
          days: product.defaultDays,
          customDose: product.standardDose,
        };
      }
      return next;
    });
  };

  const updateProductPlan = (productId: string, patch: Partial<SelectedProductPlan>) => {
    setSelectedPlans((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      return {
        ...prev,
        [productId]: { ...existing, ...patch },
      };
    });
  };

  const applySeasonalPreset = () => {
    if (seasonObserved === 'Summer / Heat Stress') {
      setSelectedPlans({
        'prd-calgophos': { productId: 'prd-calgophos', selectedSkuCode: 'AE94489', days: 3 }, // 5L
        'prd-vimeral': { productId: 'prd-vimeral', selectedSkuCode: 'AE93889', days: 5 }, // Vimeral Forte 5L
        'prd-brotone': { productId: 'prd-brotone', selectedSkuCode: 'AE96299', days: 5 }, // 5L
      });
    } else if (seasonObserved === 'Monsoon / Wet Litter') {
      setSelectedPlans({
        'prd-toximar': { productId: 'prd-toximar', selectedSkuCode: 'AF91129', days: 14 }, // 20kg
        'prd-addon': { productId: 'prd-addon', selectedSkuCode: 'AF98889', days: 7 }, // 1kg
        'prd-brotone': { productId: 'prd-brotone', selectedSkuCode: 'AE96299', days: 5 },
      });
    } else if (seasonObserved === 'Winter / Cold Ammonia') {
      setSelectedPlans({
        'prd-trox': { productId: 'prd-trox', selectedSkuCode: 'AF96829', days: 3 }, // 120g
        'prd-hepono': { productId: 'prd-hepono', selectedSkuCode: 'AF95689', days: 5 }, // 500g
        'prd-vitagro': { productId: 'prd-vitagro', selectedSkuCode: 'AE94549', days: 5 }, // 1L
      });
    } else {
      setSelectedPlans({
        'prd-groviplex': { productId: 'prd-groviplex', selectedSkuCode: 'AW94329', days: 7 }, // 5L
        'prd-vitablend': { productId: 'prd-vitablend', selectedSkuCode: 'AL93889', days: 4 }, // 1L
        'prd-calgophos': { productId: 'prd-calgophos', selectedSkuCode: 'AE94489', days: 3 },
      });
    }
  };

  const handleRecordFarmVisit = () => {
    if (!farmerName.trim() || !farmName.trim() || !farmerPhone.trim()) {
      setValidationError(
        'Please enter Farmer Name, Farm Name, and Mobile Number before saving the consultation record.'
      );
      return;
    }
    setValidationError('');

    const parsedDate = visitDateTime ? new Date(visitDateTime) : new Date();
    const recordedIso = isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();
    const followUpDueIso = new Date(
      new Date(recordedIso).getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const record: FarmVisitRecord = {
      id: `vis-${Date.now()}`,
      recordedAt: recordedIso,
      followUpDueAt: followUpDueIso,
      followUpStatus: 'pending',
      boName: officerProfile.officerName,
      boEmail: officerProfile.officerEmail,
      boPhone: officerProfile.officerPhone,
      buUnit: officerProfile.buUnit,
      region: officerProfile.region,
      hq: officerProfile.hq,
      officerName: officerProfile.officerName,
      officerEmail: officerProfile.officerEmail,
      farmerName: farmerName.trim(),
      farmName: farmName.trim(),
      farmerPhone: farmerPhone.trim(),
      farmerEmail: farmerEmail.trim(),
      villageLocation: villageLocation.trim(),
      seasonObserved,
      birdType,
      flockSize,
      ageValue,
      targetBW: bwAnalysis.targetBW,
      observedBW,
      observedEggPct: birdType === BirdType.Layer ? observedEggPct : undefined,
      targetEggPct: birdType === BirdType.Layer ? targetEggPct : undefined,
      eggPricePerUnit: birdType === BirdType.Layer ? eggPricePerUnit : undefined,
      targetEggCount: birdType === BirdType.Layer ? targetDailyEggs : undefined,
      observedEggCount: birdType === BirdType.Layer ? observedDailyEggs : undefined,
      dailyEggDeficit: birdType === BirdType.Layer ? dailyEggDeficit : undefined,
      dailyFinancialLoss: birdType === BirdType.Layer ? dailyFinancialLoss : undefined,
      monthlyFinancialLoss: birdType === BirdType.Layer ? monthlyFinancialLoss : undefined,
      selectedLayerIssueIds: birdType === BirdType.Layer ? selectedLayerIssueIds : [],
      weightStatus: bwAnalysis.isOptimalOrAbove ? 'optimal' : 'underweight',
      weightDeficitGrams: bwAnalysis.weightDeficitGrams,
      extraFeedFlockKg: bwAnalysis.flockExtraFeedKg,
      selectedReasonIds: bwAnalysis.isOptimalOrAbove ? [] : selectedReasonIds,
      consultantReferred,
      consultantReferralNotes: consultantNotes.trim(),
      diagnosedDiseaseIds: preselectedDiseaseIds,
      selectedProducts: calculatedSelectedProducts.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        skuCode: c.sku.code,
        packName: c.sku.packName,
        doseRate: c.doseRate,
        doseUnit: c.product.doseUnit,
        dosageBasis: c.product.dosageBasis,
        days: c.days,
        totalQuantity: c.totalQuantity,
        packsRounded: c.packsRounded,
        mrpPerPack: c.sku.mrp,
        ptrPerPack: c.sku.ptr,
        totalPackCostMrp: c.commercialPackCostMrp,
        costPerBird: c.costPerBirdExactMrp,
      })),
      totalPrescriptionCost: totalCommercialPackCost,
      totalCostPerBird: totalCostPerBirdExact,
      fieldNotes: fieldNotes.trim(),
    };

    onSaveVisit(record);
    setLastSavedVisit(record);
  };

  const currentLiveVisit: FarmVisitRecord = useMemo(() => {
    if (lastSavedVisit) return lastSavedVisit;
    const parsedDate = visitDateTime ? new Date(visitDateTime) : new Date();
    const recordedIso = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
    return {
      id: 'current-preview',
      recordedAt: recordedIso,
      followUpDueAt: new Date(new Date(recordedIso).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      followUpStatus: 'pending',
      boName: officerProfile.officerName,
      boEmail: officerProfile.officerEmail,
      boPhone: officerProfile.officerPhone,
      buUnit: officerProfile.buUnit,
      region: officerProfile.region,
      hq: officerProfile.hq,
      officerName: officerProfile.officerName,
      officerEmail: officerProfile.officerEmail,
      farmerName: farmerName.trim() || 'Farmer (Sample)',
      farmName: farmName.trim() || 'Poultry Farm',
      farmerPhone: farmerPhone.trim() || officerProfile.officerPhone,
      farmerEmail: farmerEmail.trim(),
      villageLocation: villageLocation.trim() || officerProfile.hq,
      seasonObserved,
      birdType,
      flockSize,
      ageValue,
      targetBW: bwAnalysis.targetBW,
      observedBW,
      observedEggPct: birdType === BirdType.Layer ? observedEggPct : undefined,
      targetEggPct: birdType === BirdType.Layer ? targetEggPct : undefined,
      eggPricePerUnit: birdType === BirdType.Layer ? eggPricePerUnit : undefined,
      targetEggCount: birdType === BirdType.Layer ? targetDailyEggs : undefined,
      observedEggCount: birdType === BirdType.Layer ? observedDailyEggs : undefined,
      dailyEggDeficit: birdType === BirdType.Layer ? dailyEggDeficit : undefined,
      dailyFinancialLoss: birdType === BirdType.Layer ? dailyFinancialLoss : undefined,
      monthlyFinancialLoss: birdType === BirdType.Layer ? monthlyFinancialLoss : undefined,
      selectedLayerIssueIds: birdType === BirdType.Layer ? selectedLayerIssueIds : [],
      weightStatus: bwAnalysis.isOptimalOrAbove ? 'optimal' : 'underweight',
      weightDeficitGrams: bwAnalysis.weightDeficitGrams,
      extraFeedFlockKg: bwAnalysis.flockExtraFeedKg,
      selectedReasonIds: bwAnalysis.isOptimalOrAbove ? [] : selectedReasonIds,
      consultantReferred,
      consultantReferralNotes: consultantNotes.trim(),
      diagnosedDiseaseIds: preselectedDiseaseIds,
      selectedProducts: calculatedSelectedProducts.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        skuCode: c.sku.code,
        packName: c.sku.packName,
        doseRate: c.doseRate,
        doseUnit: c.product.doseUnit,
        dosageBasis: c.product.dosageBasis,
        days: c.days,
        totalQuantity: c.totalQuantity,
        packsRounded: c.packsRounded,
        mrpPerPack: c.sku.mrp,
        ptrPerPack: c.sku.ptr,
        totalPackCostMrp: c.commercialPackCostMrp,
        costPerBird: c.costPerBirdExactMrp,
      })),
      totalPrescriptionCost: totalCommercialPackCost,
      totalCostPerBird: totalCostPerBirdExact,
      fieldNotes: fieldNotes.trim() || 'Standard seasonal health protocol and biosecurity advice provided.',
    };
  }, [
    lastSavedVisit,
    visitDateTime,
    officerProfile,
    farmerName,
    farmName,
    farmerPhone,
    farmerEmail,
    villageLocation,
    seasonObserved,
    birdType,
    flockSize,
    ageValue,
    bwAnalysis,
    observedBW,
    observedEggPct,
    selectedReasonIds,
    consultantReferred,
    consultantNotes,
    preselectedDiseaseIds,
    calculatedSelectedProducts,
    totalCommercialPackCost,
    totalCostPerBirdExact,
    fieldNotes,
  ]);

  const handleShareWhatsAppSummary = () => {
    const sym = officerProfile.currencySymbol;
    const statusLine = bwAnalysis.isOptimalOrAbove
      ? `Exemplary Growth! Observed ${observedBW}g meets/exceeds standard benchmark ${bwAnalysis.targetBW}g (${bwAnalysis.achievementPct.toFixed(1)}%).`
      : `Flock is ${bwAnalysis.weightDeficitGrams.toFixed(0)}g underweight against ${bwAnalysis.targetBW}g standard in ${seasonObserved}. Approx extra feed required: ${bwAnalysis.flockExtraFeedKg.toFixed(1)} kg across ${flockSize.toLocaleString()} birds.`;

    const reasonsText =
      selectedReasonIds.length > 0
        ? `\n*Probable Seasonal Factors Noted:*\n` +
          selectedReasonIds
            .map((id) => {
              const r = activeSeasonalReasons.find((x) => x.id === id);
              return r ? `- ${r.title}` : '';
            })
            .filter(Boolean)
            .join('\n')
        : '';

    const prodText = calculatedSelectedProducts
      .map(
        (c, i) =>
          `${i + 1}. *${c.product.name}* [${c.sku.packName}] (Code: ${c.sku.code})\n   Dose: ${c.doseRate}${c.product.doseUnit} × ${c.days} days | Total: ${formatQuantity(c.totalQuantity, c.product.doseUnit)} | Cost: ${sym}${c.costPerBirdExactMrp.toFixed(2)}/bird`
      )
      .join('\n\n');

    const text = [
      `*Virbac Poultry Field Technical Consultation*`,
      `Farm: ${farmName || 'Valued Farm'} (${farmerName || 'Farmer'})`,
      `Flock: ${flockSize.toLocaleString()} ${birdType} · ${birdType === BirdType.Broiler ? `Day ${ageValue}` : `Week ${ageValue}`}`,
      `Season: ${seasonObserved}`,
      ``,
      `*Flock Assessment:*`,
      statusLine,
      reasonsText,
      calculatedSelectedProducts.length > 0 ? `\n*Recommended Virbac Portfolio & Economics:*` : '',
      prodText,
      calculatedSelectedProducts.length > 0
        ? `\nTotal Farmer Investment: *${sym}${totalCostPerBirdExact.toFixed(2)} per bird*`
        : '',
      consultantReferred
        ? `\n*Poultry Consultant Advised:* Dr. ${officerProfile.consultantName || 'Poultry Consultant'} (${officerProfile.consultantPhone})`
        : '',
      `\nNext Technical Follow-Up Call: 7 days from visit (${officerProfile.officerName})`,
    ]
      .filter(Boolean)
      .join('\n');

    const cleanPhone = farmerPhone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const resetFormForNextFarm = () => {
    setVisitDateTime(toLocalDateTimeInputValue(new Date()));
    setFarmerName('');
    setFarmName('');
    setFarmerPhone('');
    setFarmerEmail('');
    setVillageLocation('');
    setFieldNotes('');
    setSelectedReasonIds([]);
    setConsultantReferred(false);
    setConsultantNotes('');
    setShowConsultantCard(false);
    setLastSavedVisit(null);
    setValidationError('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header & Main Toolbar */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div className="flex items-center gap-3.5">
          <img
            src="https://in.virbac.com/assets/virbac/build/images/virbac-logo.03fd5e40.svg"
            alt="Virbac"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="border-l-2 border-slate-300 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Poultry <span className="text-emerald-700">Connect</span>
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                {officerProfile.buUnit || 'Poultry BU'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              BO: {officerProfile.officerName} · HQ: {officerProfile.hq || 'HQ'} · Region: {officerProfile.region || 'Region'}
            </p>
          </div>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setPricingMode('mrp')}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                pricingMode === 'mrp'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Farmer MRP (₹)
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('ptr')}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                pricingMode === 'ptr'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trade PTR (₹)
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="Generates official printable prescription with BO and Farm Details"
          >
            <Printer className="h-4 w-4 text-emerald-600" />
            Print Farmer Report
          </button>
          <button
            type="button"
            onClick={handleShareWhatsAppSummary}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            Share WhatsApp
          </button>
          <button
            type="button"
            onClick={resetFormForNextFarm}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            New Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: Farm Visit Metadata + Season & Flock Parameters */}
        <div className="space-y-6 lg:col-span-5">
          {/* Section 01: Farm Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">01. Customer &amp; Farm Record</h2>
              <span className="text-xs text-slate-500">Auto +7d Follow-Up</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Visit Date &amp; Exact Time *
                </label>
                <input
                  type="datetime-local"
                  value={visitDateTime}
                  onChange={(e) => setVisitDateTime(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Farmer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Babu"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Poultry Farm Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Sai Poultry Farm"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="+91 98480 00000"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Village / Shed Location</label>
                <input
                  type="text"
                  placeholder="e.g. Siddipet Cluster, Shed 2"
                  value={villageLocation}
                  onChange={(e) => setVillageLocation(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Section 02: Season & Flock Parameters */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">02. Seasonal Context &amp; Flock Weight</h2>
              <span className="text-xs text-slate-500">{bwAnalysis.phaseLabel}</span>
            </div>

            {/* Season Selector */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Observed Season on Farm</label>
                <span className="text-[11px] text-slate-500">Dictates environmental stress</span>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg bg-slate-100 p-1 text-xs">
                {(
                  [
                    'Summer / Heat Stress',
                    'Monsoon / Wet Litter',
                    'Winter / Cold Ammonia',
                    'Seasonal Transition',
                  ] as const
                ).map((season) => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => setSeasonObserved(season)}
                    className={`rounded-md px-2.5 py-2 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      seasonObserved === season
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {season.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Bird Type Selector */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">Flock Category</label>
              <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleBirdTypeChange(BirdType.Broiler)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    birdType === BirdType.Broiler
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Broiler (Day 1–56)
                </button>
                <button
                  type="button"
                  onClick={() => handleBirdTypeChange(BirdType.Layer)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    birdType === BirdType.Layer
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Layer (Week 1–72)
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  {birdType === BirdType.Broiler ? 'Broiler Age (Day 1 to 56)' : 'Layer Flock Age (Week 1 to 72)'}
                </label>
                <select
                  value={ageValue}
                  onChange={(e) => setAgeValue(Number(e.target.value))}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium tabular-nums"
                >
                  {birdType === BirdType.Broiler
                    ? Object.values(BROILER_STD_DATA).map((b) => (
                        <option key={b.day} value={b.day}>
                          Day {b.day} — Standard Target: {b.bw} g · FCR {b.fcr.toFixed(2)}
                        </option>
                      ))
                    : Object.values(LAYER_STD_DATA).map((l) => (
                        <option key={l.week} value={l.week}>
                          Week {l.week} — {l.phaseLabel} · Std Target: {l.bw} g
                          {l.targetEggPct > 0 ? ` · Benchmark Lay ${l.targetEggPct}%` : ' · Growing Pullet'}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Total Flock Count (Birds) *</label>
                <input
                  type="number"
                  min={50}
                  step={500}
                  value={flockSize}
                  onChange={(e) => setFlockSize(Math.max(1, Number(e.target.value)))}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold tabular-nums"
                />
              </div>

              {birdType === BirdType.Layer && isLayingPhase ? (
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">Observed Hen-Day Lay (%) *</label>
                      <span className="font-mono text-[11px] font-bold text-blue-700">Target: {targetEggPct}%</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={observedEggPct}
                      onChange={(e) => setObservedEggPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold tabular-nums"
                    />
                    <div className="mt-1 flex flex-wrap gap-1">
                      {[95, 90, 85, 80, 75].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setObservedEggPct(pct)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium border cursor-pointer ${
                            observedEggPct === pct
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Egg Farm Price (₹ / egg)</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      step={0.25}
                      value={eggPricePerUnit}
                      onChange={(e) => setEggPricePerUnit(Math.max(1, Number(e.target.value)))}
                      className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold tabular-nums"
                    />
                    <div className="mt-1 flex flex-wrap gap-1">
                      {[5.0, 5.5, 6.0, 6.5].map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setEggPricePerUnit(pr)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium border cursor-pointer ${
                            eggPricePerUnit === pr
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ₹{pr.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Observed Body Weight (g)</label>
                    <input
                      type="number"
                      min={100}
                      step={10}
                      value={observedBW}
                      onChange={(e) => setObservedBW(Math.max(0, Number(e.target.value)))}
                      className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold tabular-nums"
                    />
                    <span className="text-[10px] text-slate-500">Benchmark: {bwAnalysis.targetBW} g</span>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Observed Average Weight (g) *</label>
                  <input
                    type="number"
                    min={10}
                    step={5}
                    value={observedBW}
                    onChange={(e) => setObservedBW(Math.max(0, Number(e.target.value)))}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold tabular-nums"
                  />
                  <span className="text-[10px] text-slate-500">Standard Target: {bwAnalysis.targetBW} g</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Live Performance Diagnostics, Layer Egg Deficit & Economics / Broiler Underweight */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 03: Performance Assessment */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {birdType === BirdType.Layer && isLayingPhase
                  ? '03. Layer Production Diagnostics, Egg Deficit & Revenue Impact'
                  : '03. Body Weight Assessment & Seasonal Growth Verdict'}
              </h2>
              <span className="text-xs font-semibold text-blue-700">
                {birdType === BirdType.Layer ? `Week ${ageValue} Laying Flock` : `Day ${ageValue} Broiler`} · {seasonObserved}
              </span>
            </div>

            {/* METRICS GRID: Distinct for Layer vs Broiler */}
            {birdType === BirdType.Layer && isLayingPhase ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Benchmark Hen-Day Lay</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                    {targetEggPct}%
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    Expected: {targetDailyEggs.toLocaleString()} eggs/day
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Observed Hen-Day Lay</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                    {observedEggPct}%
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    Actual: {observedDailyEggs.toLocaleString()} eggs/day
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Daily Eggs Deficit (Loss)</p>
                  <p
                    className={`mt-1 font-mono text-xl font-bold tabular-nums ${
                      isLayerProductionOptimal ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {isLayerProductionOptimal ? 'Target Achieved' : `-${dailyEggDeficit.toLocaleString()} eggs/d`}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    {isLayerProductionOptimal ? `+${(observedEggPct - targetEggPct).toFixed(1)}%` : `-${eggDeficitPct.toFixed(1)}% drop`}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Daily Financial Loss (@₹{eggPricePerUnit.toFixed(2)})</p>
                  <p
                    className={`mt-1 font-mono text-xl font-bold tabular-nums ${
                      isLayerProductionOptimal ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {isLayerProductionOptimal ? '₹0' : `₹${dailyFinancialLoss.toLocaleString()}/d`}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    Monthly: ₹{monthlyFinancialLoss.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Standard Target</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                    {bwAnalysis.targetBW.toLocaleString()} g
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Observed Average</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                    {bwAnalysis.observedBW.toLocaleString()} g
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    {bwAnalysis.achievementPct.toFixed(1)}% of benchmark
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Weight Variance</p>
                  <p
                    className={`mt-1 font-mono text-xl font-bold tabular-nums ${
                      bwAnalysis.isOptimalOrAbove ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {bwAnalysis.isOptimalOrAbove
                      ? `+${Math.max(0, bwAnalysis.weightDeltaGrams).toFixed(0)} g`
                      : `-${bwAnalysis.weightDeficitGrams.toFixed(0)} g`}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Extra Feed Required</p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                    {bwAnalysis.catchupFeedGramsPerBird.toFixed(1)} g
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                    Flock: {bwAnalysis.flockExtraFeedKg.toFixed(1)} kg
                  </p>
                </div>
              </div>
            )}

            {/* LAYER-SPECIFIC DIAGNOSTICS & ACTIONS */}
            {birdType === BirdType.Layer && isLayingPhase ? (
              <div className="mt-4 space-y-4">
                {isLayerProductionOptimal ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                    <div className="flex items-start gap-3">
                      <Award className="mt-0.5 h-5 w-5 text-emerald-700 shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-emerald-950">
                          Flock Meets / Exceeds Hen-Day Lay Benchmark ({observedEggPct}%) — Commend the Farmer!
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-emerald-900">
                          Outstanding egg production management by <strong>{farmerName || 'the farmer'}</strong>! Sustaining{' '}
                          <strong className="font-mono tabular-nums">{observedEggPct}%</strong> Hen-Day Lay in{' '}
                          <strong>Week {ageValue}</strong> ({observedDailyEggs.toLocaleString()} eggs/day) proves excellent feed formulation, lighting regimen, and shed biosecurity.
                        </p>
                        <p className="mt-2 text-xs font-semibold text-emerald-800">
                          Officer Recommendation: Maintain peak persistency and protect medullary bone reserves with{' '}
                          <strong>Groblend Forte 20kg</strong> or <strong>Starblend 5kg</strong>, and supply <strong>Calgophos</strong> (3 days monthly) to eliminate micro-cracks.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700 shrink-0" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-sm font-bold text-amber-950">
                            Layer Hen-Day Drop of -{eggDeficitPct.toFixed(1)}% · Losing {dailyEggDeficit.toLocaleString()} Eggs/Day
                          </h3>
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                            ₹{dailyFinancialLoss.toLocaleString()}/day Revenue Drain
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-amber-900">
                          The farmer is experiencing a direct economic loss of approx{' '}
                          <strong className="font-mono tabular-nums">₹{monthlyFinancialLoss.toLocaleString()} per month</strong>.
                          A focused 3–5 day course of <strong>Calgophos (acidic liquid minerals)</strong> and <strong>Chelated OstoVet Forte / Vitablend WMF</strong> restores shell gland calcification, medullary bone reserves, and egg output, returning over 500% ROI.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAYER HEALTH & EGGSHELL QUALITY CHECKLIST */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Layer Health, Eggshell Quality &amp; Production Problems (Select Observed Issues)
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {selectedLayerIssueIds.length} Selected
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2.5">
                    {LAYER_SPECIFIC_ISSUES.map((issue) => {
                      const checked = selectedLayerIssueIds.includes(issue.id);
                      return (
                        <div
                          key={issue.id}
                          className={`rounded-xl border p-3.5 transition-all ${
                            checked
                              ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleLayerIssue(issue.id)}
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border cursor-pointer ${
                                checked ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {checked && <Check className="h-3 w-3" />}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <p className="text-xs font-bold text-slate-900">{issue.title}</p>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                                  {issue.category}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[11px] font-medium text-slate-600">{issue.subtitle}</p>
                              
                              <div className="mt-2 space-y-1 text-[11px] text-slate-700">
                                <p>
                                  <strong className="text-slate-800">Primary Cause:</strong> {issue.primaryCause}
                                </p>
                                <p>
                                  <strong className="text-slate-800">Key Symptoms:</strong> {issue.symptoms.join(' · ')}
                                </p>
                                <p className="text-red-700 font-semibold">
                                  Economic Drain: {issue.economicImpact}
                                </p>
                              </div>

                              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2">
                                <p className="text-[11px] font-semibold text-blue-900">
                                  Virbac Rx: {issue.recommendedAdvice}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleAddIssueProducts(issue.recommendedProductIds)}
                                  className="rounded-md bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-800 cursor-pointer shadow-xs"
                                >
                                  + Prescribe Recommended Solution
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONSULT POULTRY SPECIALIST / VET FOR LAYERS */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2.5">
                      <Stethoscope className="h-5 w-5 text-blue-700 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-blue-950">
                          Poultry Consultant &amp; Layer Nutritionist Referral
                        </h4>
                        <p className="text-[11px] text-blue-900">
                          Severe production slumps (&gt;10% drop) or persistent shell breakages require veterinary candling &amp; necropsy.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setConsultantReferred(true);
                        setShowConsultantCard(true);
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      Consult Poultry Specialist
                    </button>
                  </div>

                  {showConsultantCard && (
                    <div className="mt-3.5 rounded-lg border border-blue-300 bg-white p-3.5 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">
                          Consultant: {officerProfile.consultantName || 'Dr. Srinivas Rao, MVSc'}
                        </span>
                        <span className="font-mono text-slate-600 tabular-nums">
                          {officerProfile.consultantPhone || '+91 94401 22334'}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">
                        Recommended Investigations: Shell breaking strength measurement, medullary bone calcium titration, and feed aflatoxin/ochratoxin ELISA.
                      </p>
                      <div className="mt-2">
                        <label className="block text-[11px] font-semibold text-slate-700">Specific Referral Observations:</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Week 26 layer flock with 11% lay drop, hairline cracked shells, and cage fatigue. Suspected Ca:P metabolic alkalosis."
                          value={consultantNotes}
                          onChange={(e) => setConsultantNotes(e.target.value)}
                          className="mt-1 w-full rounded border border-slate-300 p-2 text-xs"
                        />
                      </div>
                      <div className="mt-2.5 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const msg = `*Poultry Connect — Specialist Referral Request*\nFarm: ${farmName || 'Layer Farm'}\nFarmer: ${farmerName} (${farmerPhone})\nFlock: ${flockSize.toLocaleString()} Layers (Week ${ageValue})\nObserved Lay: ${observedEggPct}% (Target: ${targetEggPct}%, Deficit: -${dailyEggDeficit} eggs/day)\nDaily Revenue Loss: ₹${dailyFinancialLoss.toLocaleString()}/day\nObserved Issues: ${selectedLayerIssueIds.join(', ')}\nNotes: ${consultantNotes || 'Requesting clinical guidance.'}\nBO: ${officerProfile.officerName} (${officerProfile.hq})`;
                            const cleanPhone = officerProfile.consultantPhone.replace(/[^0-9]/g, '');
                            const url = cleanPhone
                              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
                              : `https://wa.me/?text=${encodeURIComponent(msg)}`;
                            window.open(url, '_blank');
                          }}
                          className="rounded bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 cursor-pointer shadow-xs"
                        >
                          Send WhatsApp Referral to Specialist
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* BROILER UNDERWEIGHT / GROWTH ACTIONS */
              bwAnalysis.isOptimalOrAbove ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-5 w-5 text-emerald-700 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">
                        Flock Weight Meets / Exceeds Benchmark — Appreciate the Farmer!
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-900">
                        Commend <strong>{farmerName || 'the farmer'}</strong> on outstanding management! Achieving{' '}
                        <strong className="font-mono tabular-nums">{observedBW} g</strong> against the{' '}
                        <strong className="font-mono tabular-nums">{bwAnalysis.targetBW} g</strong> standard (
                        <strong className="font-mono tabular-nums">{bwAnalysis.achievementPct.toFixed(1)}%</strong>) in{' '}
                        <strong>{seasonObserved}</strong> demonstrates excellent brooding control, feeder space, and pipeline
                        hygiene.
                      </p>
                      <p className="mt-2 text-xs font-semibold text-emerald-800">
                        Officer Recommendation: Maintain peak growth momentum and prevent bone depletion
                        with Calgophos, Brotone Vet, or Vimeral Forte.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-red-700 shrink-0" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-sm font-bold text-red-950">
                            Flock Underweight by {bwAnalysis.weightDeficitGrams.toFixed(0)} g / bird in {seasonObserved}
                          </h3>
                          <button
                            type="button"
                            onClick={applySeasonalPreset}
                            className="rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-semibold text-red-900 hover:bg-red-50 cursor-pointer shadow-xs"
                          >
                            Load Seasonal Portfolio Protocol
                          </button>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-red-900">
                          Flock requires approx{' '}
                          <strong className="font-mono tabular-nums">{bwAnalysis.flockExtraFeedKg.toFixed(1)} kg</strong> of
                          extra feed across {flockSize.toLocaleString()} birds to catch up. Discuss the seasonal
                          pathophysiology reasons below with the farmer:
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Reasons Checklist for Broilers */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Seasonal Reasons &amp; Conditions Causing Reduced Body Weight ({seasonObserved})
                    </h3>
                    <div className="mt-2 space-y-2.5">
                      {activeSeasonalReasons.map((reason) => {
                        const checked = selectedReasonIds.includes(reason.id);
                        return (
                          <div
                            key={reason.id}
                            className={`rounded-lg border p-3.5 transition-colors ${
                              checked ? 'border-amber-400 bg-amber-50/60' : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <button
                                type="button"
                                onClick={() => toggleReason(reason.id)}
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border cursor-pointer ${
                                  checked ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {checked && <Check className="h-3 w-3" />}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900">{reason.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600">{reason.pathophysiology}</p>
                                <div className="mt-2 text-[11px] text-slate-700">
                                  <strong className="text-slate-800">Shed Clinical Indicators:</strong>{' '}
                                  {reason.shedIndicators.join(' · ')}
                                </div>
                                <p className="mt-1 text-[11px] font-semibold text-emerald-800">
                                  Corrective Field Action: {reason.fieldAction}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CONSULT POULTRY CONSULTANT ADVISORY PANEL FOR BROILER */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2.5">
                        <Stethoscope className="h-5 w-5 text-blue-700 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-950">
                            Poultry Consultant &amp; Technical Veterinarian Advisory
                          </h4>
                          <p className="text-[11px] text-blue-900">
                            Weight deficits exceeding 50g require clinical oversight. Refer this farm to your Poultry Consultant.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setConsultantReferred(true);
                          setShowConsultantCard(true);
                        }}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        Consult Poultry Consultant
                      </button>
                    </div>

                    {showConsultantCard && (
                      <div className="mt-3.5 rounded-lg border border-blue-300 bg-white p-3.5 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-900">
                            Consultant: Dr. {officerProfile.consultantName || 'Poultry Technical Consultant'}
                          </span>
                          <span className="font-mono text-slate-600 tabular-nums">
                            {officerProfile.consultantPhone || '+91 94401 22334'}
                          </span>
                        </div>
                        <p className="mt-2 text-slate-600">
                          Recommended Testing: Post-mortem examination of 3 sacrificed runts, water microbiological testing (TDS/CFU),
                          and feed bin mycotoxin ELISA assay.
                        </p>
                        <div className="mt-2">
                          <label className="block text-[11px] font-semibold text-slate-700">Specific Referral Observations:</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Broiler Day 21 flock 92g behind with rales and feed passage. Suspected enteritis and heat stress."
                            value={consultantNotes}
                            onChange={(e) => setConsultantNotes(e.target.value)}
                            className="mt-1 w-full rounded border border-slate-300 p-2 text-xs"
                          />
                        </div>
                        <div className="mt-2.5 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const msg = buildConsultantReferralMessage(
                                currentLiveVisit,
                                officerProfile
                              );
                              const cleanPhone = officerProfile.consultantPhone.replace(/[^0-9]/g, '');
                              const url = cleanPhone
                                ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
                                : `https://wa.me/?text=${encodeURIComponent(msg)}`;
                              window.open(url, '_blank');
                            }}
                            className="rounded bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 cursor-pointer shadow-xs"
                          >
                            Send WhatsApp Referral to Consultant
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      </div>

      {/* FULL-WIDTH SECTION 04: VIRBAC POULTRY PRODUCT SELECTION, DOSAGE & EXACT COST-PER-BIRD */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Virbac Poultry Portfolio · Visual Aid 2026 Positioning &amp; Rate List SKUs · Water Intake:{' '}
              {effectiveWaterMlPerBird} ml/bird/day
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
              04. Position Specific Products, Select Pack SKUs &amp; Calculate Exact Farmer Cost Per Bird
            </h2>
          </div>
          <div className="no-print flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Active Pricing:</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-900 uppercase">
              {pricingMode} Rates from CSV
            </span>
          </div>
        </div>

        {/* Selected Products Table with SKU Dropdown & Cost per Bird */}
        {calculatedSelectedProducts.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold">Positioned Product</th>
                    <th className="px-3 py-2.5 font-semibold">Selected SKU Pack (from CSV)</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Dose Rate</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Course Days</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Flock Quantity</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Packs Needed</th>
                    <th className="px-3 py-2.5 text-right font-semibold">
                      Pack {pricingMode.toUpperCase()} (₹)
                    </th>
                    <th className="px-3 py-2.5 text-right font-semibold">
                      Farmer Cost / Bird ({officerProfile.currencySymbol})
                    </th>
                    <th className="no-print px-3 py-2.5 text-center font-semibold">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {calculatedSelectedProducts.map((item) => (
                    <tr key={item.product.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2.5">
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.product.positioning}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <select
                          aria-label={`SKU for ${item.product.name}`}
                          value={item.sku.code}
                          onChange={(e) =>
                            updateProductPlan(item.product.id, { selectedSkuCode: e.target.value })
                          }
                          className="rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs tabular-nums"
                        >
                          {item.product.skus.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.packName} — Code: {s.code} (MRP ₹{s.mrp} | PTR ₹{s.ptr})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min={0.1}
                            step={0.5}
                            aria-label={`Dose for ${item.product.name}`}
                            value={item.doseRate}
                            onChange={(e) =>
                              updateProductPlan(item.product.id, {
                                customDose: Math.max(0.1, Number(e.target.value)),
                              })
                            }
                            className="w-16 rounded border border-slate-300 px-1.5 py-1 text-right font-mono text-xs tabular-nums"
                          />
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {item.product.doseUnit}/{item.product.dosageBasis === 'per_100_birds' ? '100b' : item.product.dosageBasis === 'per_1000_birds' ? '1000b' : 'L'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          aria-label={`Days for ${item.product.name}`}
                          value={item.days}
                          onChange={(e) =>
                            updateProductPlan(item.product.id, {
                              days: Math.max(1, Number(e.target.value)),
                            })
                          }
                          className="w-14 rounded border border-slate-300 px-1.5 py-1 text-right font-mono text-xs tabular-nums"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-800 tabular-nums">
                        {formatQuantity(item.totalQuantity, item.product.doseUnit)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-700 tabular-nums">
                        {item.packsRounded} × {item.sku.packName}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-900 tabular-nums">
                        {pricingMode === 'mrp' ? `₹${item.commercialPackCostMrp.toFixed(0)}` : `₹${item.commercialPackCostPtr.toFixed(0)}`}
                        <span className="block text-[10px] text-slate-500">
                          Unit: {pricingMode === 'mrp' ? `₹${item.sku.mrp}` : `₹${item.sku.ptr}`}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-sm font-bold text-emerald-700 tabular-nums">
                        {officerProfile.currencySymbol}
                        {(pricingMode === 'mrp' ? item.costPerBirdExactMrp : item.costPerBirdExactPtr).toFixed(2)}
                        <span className="block text-[10px] font-normal text-slate-500">
                          {officerProfile.currencySymbol}
                          {item.costPerBirdPerDay.toFixed(2)}/bird/day
                        </span>
                      </td>
                      <td className="no-print px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProduct(item.product)}
                          className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* High-Impact Economics Summary Banner */}
            <div className="mt-3 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-900 p-4 text-white sm:flex-row sm:items-center">
              <div>
                <p className="text-xs text-slate-300">
                  Total Farmer Investment across {flockSize.toLocaleString()} {birdType} Birds
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-200">
                  Total Commercial Packs Value ({pricingMode.toUpperCase()}):{' '}
                  <strong className="font-mono text-white tabular-nums">
                    {officerProfile.currencySymbol}
                    {totalCommercialPackCost.toFixed(0)}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[11px] text-slate-300">Net Cost / Bird (Dosage Consumed)</p>
                  <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                    {officerProfile.currencySymbol}
                    {totalCostPerBirdExact.toFixed(2)} / bird
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-300">Pack Purchase / Bird</p>
                  <p className="font-mono text-lg font-semibold text-slate-100 tabular-nums">
                    {officerProfile.currencySymbol}
                    {totalCostPerBirdPack.toFixed(2)} / bird
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">No products positioned yet.</p>
            <p className="mt-1 text-xs text-slate-500">
              Select products from the Virbac portfolio below to calculate doses, packs, and cost per bird.
            </p>
          </div>
        )}

        {/* Product Catalog Cards with Positioning & Key Benefits */}
        <div className="no-print mt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search products by brand, composition, positioning, or SKU code..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <select
              aria-label="Filter category"
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="min-h-[42px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
            >
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Portfolio Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((prod) => {
              const isSelected = Boolean(selectedPlans[prod.id]);
              return (
                <div
                  key={prod.id}
                  className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-medium text-slate-500">{prod.category}</span>
                        <h3 className="text-sm font-bold text-slate-900">{prod.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProduct(prod)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border cursor-pointer ${
                          isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    </div>

                    <p className="mt-1.5 text-xs font-medium text-emerald-950 italic">
                      "{prod.positioning}"
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                      <strong>Comp:</strong> {prod.composition}
                    </p>

                    <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                      {prod.keyBenefits.slice(0, 2).map((b, idx) => (
                        <p key={idx} className="line-clamp-1">
                          • {b}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                      Std Dose: {prod.standardDose} {prod.doseUnit} /{' '}
                      {prod.dosageBasis === 'per_100_birds' ? '100b' : prod.dosageBasis === 'per_1000_birds' ? '1000b' : 'L'}
                    </p>
                    <p className="font-mono text-[11px] text-slate-700 font-semibold tabular-nums">
                      SKUs: {prod.skus.map((s) => `${s.packName} (₹${s.mrp})`).join(' · ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 05: OFFICER RECORD KEEPING & 7-DAY FOLLOW-UP ARMING */}
      <section className="no-print mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-bold text-slate-900">05. Farm Consultation Record &amp; Suggestions Given</h2>
        <p className="mt-1 text-xs text-slate-600">
          Maintains records of farms visited, suggestions given, products discussed, and arms automatic 7-day follow-up.
        </p>

        <div className="mt-3">
          <label className="block text-xs font-semibold text-slate-700">
            Field Officer Discussion Notes &amp; Recommendations to Farmer
          </label>
          <textarea
            rows={2}
            placeholder="Record farmer commitments, feed mill batch number, water quality observations, and dosage instructions..."
            value={fieldNotes}
            onChange={(e) => setFieldNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900"
          />
        </div>

        {validationError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-800">
            {validationError}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 tabular-nums">
            Officer: <strong>{officerProfile.officerName}</strong> ({officerProfile.officerEmail}) · 7-Day Follow-Up Due:{' '}
            <strong>
              {new Date(
                (visitDateTime ? new Date(visitDateTime).getTime() : Date.now()) + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleRecordFarmVisit}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Save Visit Record &amp; Schedule 7-Day Follow-Up
          </button>
        </div>

        {lastSavedVisit && (
          <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-emerald-950">
                Consultation Saved for {lastSavedVisit.farmName} ({lastSavedVisit.farmerName})
              </p>
              <p className="mt-0.5 text-xs text-emerald-900 tabular-nums">
                Recorded {new Date(lastSavedVisit.recordedAt).toLocaleString()} · 7-Day Follow-Up scheduled for{' '}
                {new Date(lastSavedVisit.followUpDueAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="min-h-[38px] rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Farmer Report
              </button>
              <button
                type="button"
                onClick={() => downloadFollowUpCalendarICS(lastSavedVisit, officerProfile)}
                className="min-h-[38px] rounded-lg border border-emerald-400 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 whitespace-nowrap cursor-pointer"
              >
                Add 7d Alert to Calendar (.ics)
              </button>
              <button
                type="button"
                onClick={onNavigateToFollowUps}
                className="min-h-[38px] rounded-lg bg-emerald-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black whitespace-nowrap cursor-pointer"
              >
                View Follow-Up CRM
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Printable Farmer Advisory & Prescription Modal */}
      <PrintFarmerReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        visit={currentLiveVisit}
        officerProfile={officerProfile}
      />
    </div>
  );
};
