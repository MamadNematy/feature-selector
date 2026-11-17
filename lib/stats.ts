// All the math of the project lives in this one file.

export type FeatureResult = {
  feature: string;
  mean: number;
  std: number;
  index: number; // J = |mean| / std
  keep: boolean;
};

// Step 1: arithmetic mean of one column
export const mean = (v: number[]): number =>
  v.reduce((sum, x) => sum + x, 0) / v.length;

// Step 2: sample standard deviation (divides by n - 1)
export const std = (v: number[]): number => {
  const m = mean(v);
  const sumSq = v.reduce((s, x) => s + (x - m) ** 2, 0);
  return Math.sqrt(sumSq / (v.length - 1));
};

// Step 3: index per column, then compare with the threshold
export function analyze(rows: number[][], threshold: number, names: string[]): FeatureResult[] {
  return names.map((feature, j) => {
    const col = rows.map((r) => r[j]);
    const m = mean(col);
    const s = std(col);
    // constant column: std = 0, so there is no spread to compare against
    const index = s === 0 ? Infinity : Math.abs(m) / s;
    return { feature, mean: m, std: s, index, keep: index >= threshold };
  });
}

// Automatic threshold: the average of all finite indices.
export function autoThreshold(rows: number[][], names: string[]): number {
  const finite = analyze(rows, 0, names).map((r) => r.index).filter(Number.isFinite);
  return finite.length ? mean(finite) : 0;
}
