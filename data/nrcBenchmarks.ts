import { BroilerBenchmark, LayerBenchmark } from '../types/poultry';

// Exact Day 1 to Day 56 Broiler Commercial Standard Body Weight & FCR Matrix
export const BROILER_STD_DATA: Record<number, BroilerBenchmark> = {
  1: { day: 1, bw: 92, fcr: 0.24, waterMlPerBird: 28, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  2: { day: 2, bw: 115, fcr: 0.40, waterMlPerBird: 36, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  3: { day: 3, bw: 135, fcr: 0.53, waterMlPerBird: 44, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  4: { day: 4, bw: 158, fcr: 0.64, waterMlPerBird: 52, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  5: { day: 5, bw: 178, fcr: 0.75, waterMlPerBird: 60, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  6: { day: 6, bw: 201, fcr: 0.85, waterMlPerBird: 68, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  7: { day: 7, bw: 221, fcr: 0.95, waterMlPerBird: 76, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  8: { day: 8, bw: 264, fcr: 0.97, waterMlPerBird: 85, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  9: { day: 9, bw: 301, fcr: 1.00, waterMlPerBird: 94, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  10: { day: 10, bw: 338, fcr: 1.03, waterMlPerBird: 104, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  11: { day: 11, bw: 377, fcr: 1.07, waterMlPerBird: 114, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  12: { day: 12, bw: 413, fcr: 1.11, waterMlPerBird: 124, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  13: { day: 13, bw: 450, fcr: 1.16, waterMlPerBird: 135, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  14: { day: 14, bw: 487, fcr: 1.20, waterMlPerBird: 146, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  15: { day: 15, bw: 564, fcr: 1.20, waterMlPerBird: 158, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  16: { day: 16, bw: 621, fcr: 1.21, waterMlPerBird: 170, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  17: { day: 17, bw: 678, fcr: 1.23, waterMlPerBird: 182, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  18: { day: 18, bw: 737, fcr: 1.24, waterMlPerBird: 194, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  19: { day: 19, bw: 793, fcr: 1.26, waterMlPerBird: 206, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  20: { day: 20, bw: 850, fcr: 1.29, waterMlPerBird: 218, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  21: { day: 21, bw: 907, fcr: 1.31, waterMlPerBird: 230, phaseLabel: 'Starter Phase (0–3 Weeks)' },
  22: { day: 22, bw: 1008, fcr: 1.31, waterMlPerBird: 242, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  23: { day: 23, bw: 1085, fcr: 1.32, waterMlPerBird: 254, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  24: { day: 24, bw: 1165, fcr: 1.33, waterMlPerBird: 266, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  25: { day: 25, bw: 1242, fcr: 1.35, waterMlPerBird: 278, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  26: { day: 26, bw: 1322, fcr: 1.37, waterMlPerBird: 290, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  27: { day: 27, bw: 1399, fcr: 1.39, waterMlPerBird: 302, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  28: { day: 28, bw: 1479, fcr: 1.41, waterMlPerBird: 314, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  29: { day: 29, bw: 1566, fcr: 1.43, waterMlPerBird: 326, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  30: { day: 30, bw: 1649, fcr: 1.45, waterMlPerBird: 338, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  31: { day: 31, bw: 1732, fcr: 1.47, waterMlPerBird: 350, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  32: { day: 32, bw: 1813, fcr: 1.48, waterMlPerBird: 362, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  33: { day: 33, bw: 1897, fcr: 1.50, waterMlPerBird: 374, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  34: { day: 34, bw: 1980, fcr: 1.52, waterMlPerBird: 386, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  35: { day: 35, bw: 2063, fcr: 1.54, waterMlPerBird: 398, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  36: { day: 36, bw: 2162, fcr: 1.56, waterMlPerBird: 410, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  37: { day: 37, bw: 2255, fcr: 1.57, waterMlPerBird: 420, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  38: { day: 38, bw: 2345, fcr: 1.59, waterMlPerBird: 430, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  39: { day: 39, bw: 2438, fcr: 1.61, waterMlPerBird: 440, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  40: { day: 40, bw: 2528, fcr: 1.63, waterMlPerBird: 450, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  41: { day: 41, bw: 2621, fcr: 1.66, waterMlPerBird: 460, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  42: { day: 42, bw: 2711, fcr: 1.68, waterMlPerBird: 470, phaseLabel: 'Grower Phase (3–6 Weeks)' },
  43: { day: 43, bw: 2832, fcr: 1.70, waterMlPerBird: 480, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  44: { day: 44, bw: 2936, fcr: 1.71, waterMlPerBird: 490, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  45: { day: 45, bw: 3043, fcr: 1.73, waterMlPerBird: 500, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  46: { day: 46, bw: 3149, fcr: 1.74, waterMlPerBird: 510, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  47: { day: 47, bw: 3255, fcr: 1.75, waterMlPerBird: 520, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  48: { day: 48, bw: 3359, fcr: 1.77, waterMlPerBird: 528, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  49: { day: 49, bw: 3466, fcr: 1.78, waterMlPerBird: 536, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  50: { day: 50, bw: 3602, fcr: 1.78, waterMlPerBird: 544, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  51: { day: 51, bw: 3725, fcr: 1.79, waterMlPerBird: 552, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  52: { day: 52, bw: 3845, fcr: 1.79, waterMlPerBird: 560, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  53: { day: 53, bw: 3968, fcr: 1.80, waterMlPerBird: 568, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  54: { day: 54, bw: 4088, fcr: 1.80, waterMlPerBird: 576, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  55: { day: 55, bw: 4211, fcr: 1.81, waterMlPerBird: 584, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
  56: { day: 56, bw: 4331, fcr: 1.81, waterMlPerBird: 592, phaseLabel: 'Finisher Phase (6–8 Weeks)' },
};

// Commercial Layer Body Weight & Production Benchmarks (Weeks 1 to 72)
export const LAYER_STD_DATA: Record<number, LayerBenchmark> = (() => {
  const data: Record<number, LayerBenchmark> = {};
  const keyPoints: [number, number, number, number][] = [
    [1, 65, 13, 0],
    [2, 110, 19, 0],
    [3, 175, 25, 0],
    [4, 245, 31, 0],
    [5, 325, 36, 0],
    [6, 410, 41, 0],
    [7, 500, 46, 0],
    [8, 590, 50, 0],
    [9, 680, 54, 0],
    [10, 770, 58, 0],
    [11, 855, 62, 0],
    [12, 935, 65, 0],
    [13, 1010, 68, 0],
    [14, 1080, 71, 0],
    [15, 1145, 74, 0],
    [16, 1205, 78, 0],
    [17, 1265, 82, 2],
    [18, 1325, 86, 12],
    [19, 1385, 92, 38],
    [20, 1440, 98, 68],
    [22, 1510, 105, 88],
    [25, 1560, 109, 95],
    [30, 1595, 110, 95],
    [35, 1615, 110, 94],
    [40, 1630, 111, 92],
    [45, 1645, 111, 90],
    [50, 1655, 110, 88],
    [55, 1665, 110, 85],
    [60, 1675, 109, 82],
    [65, 1685, 109, 79],
    [72, 1695, 108, 75],
  ];

  for (let w = 1; w <= 72; w++) {
    let lower = keyPoints[0];
    let upper = keyPoints[keyPoints.length - 1];
    for (let i = 0; i < keyPoints.length - 1; i++) {
      if (w >= keyPoints[i][0] && w <= keyPoints[i + 1][0]) {
        lower = keyPoints[i];
        upper = keyPoints[i + 1];
        break;
      }
    }
    const span = upper[0] - lower[0] || 1;
    const ratio = (w - lower[0]) / span;
    const bw = Math.round(lower[1] + (upper[1] - lower[1]) * ratio);
    const feed = Math.round(lower[2] + (upper[2] - lower[2]) * ratio);
    const egg = Math.round(lower[3] + (upper[3] - lower[3]) * ratio);
    const phaseLabel =
      w <= 6
        ? 'Chick Brooding (Wk 1–6)'
        : w <= 18
        ? 'Pullet Grower & Pre-Lay (Wk 7–18)'
        : w <= 45
        ? 'Peak Laying Phase (Wk 19–45)'
        : 'Mid-to-Late Lay (Wk 46–72)';
    data[w] = {
      week: w,
      bw,
      feedGramsPerDay: feed,
      waterMlPerBird: Math.round(feed * 2.15),
      targetEggPct: egg,
      phaseLabel,
    };
  }
  return data;
})();
