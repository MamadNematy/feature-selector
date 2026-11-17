export const MAX_COLS = 12;

export const defaultNames = (n: number) => Array.from({ length: n }, (_, j) => `F${j + 1}`);

// Default dataset: 4 rows x 4 columns
export const SAMPLE = [
  [5.1, 0.3, 3.5, -1.2],
  [4.9, -0.8, 3.0, 1.4],
  [4.7, 0.5, 3.2, -0.6],
  [5.0, -0.4, 3.6, 1.1],
];

// 12 rows of the classic Iris dataset (4 per species)
export const IRIS_NAMES = ["sepal_length", "sepal_width", "petal_length", "petal_width"];
export const IRIS = [
  [5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2], [4.6, 3.1, 1.5, 0.2],
  [7.0, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5], [5.5, 2.3, 4.0, 1.3],
  [6.3, 3.3, 6.0, 2.5], [5.8, 2.7, 5.1, 1.9], [7.1, 3.0, 5.9, 2.1], [6.3, 2.9, 5.6, 1.8],
];

// Random number between a and b, rounded to 1 decimal
const rand = (a: number, b: number) => Math.round((a + Math.random() * (b - a)) * 10) / 10;

// Each column gets a random center (-80 to 80) and spread (5 to 20),
// so every value stays between -100 and 100
export function randomCells(rowCount: number, colCount: number): string[][] {
  const cols = Array.from({ length: colCount }, () => ({ c: rand(-80, 80), s: rand(5, 20) }));
  return Array.from({ length: rowCount }, () => cols.map(({ c, s }) => String(rand(c - s, c + s))));
}

// Reads comma, semicolon or tab separated text. A first row with text is used as header.
export function parseCsv(text: string): { names: string[]; cells: string[][] } | null {
  const lines = text.trim().split(/\r?\n/).filter(Boolean).map((l) => l.split(/[,;\t]/).map((x) => x.trim()));
  if (!lines.length) return null;
  const hasHeader = lines[0].some((x) => x !== "" && !Number.isFinite(Number(x)));
  const count = Math.min(lines[0].length, MAX_COLS);
  const names = hasHeader ? lines[0].slice(0, count) : defaultNames(count);
  const body = hasHeader ? lines.slice(1) : lines;
  return { names, cells: body.map((r) => names.map((_, j) => r[j] ?? "")) };
}

export const toCsv = (names: string[], rows: number[][]): string =>
  [names.join(","), ...rows.map((r) => r.join(","))].join("\n");
