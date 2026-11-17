import { describe, expect, it } from "vitest";
import { analyze, autoThreshold, mean, std } from "./stats";

const DATA = [
  [5.1, 0.3, 3.5, -1.2],
  [4.9, -0.8, 3.0, 1.4],
  [4.7, 0.5, 3.2, -0.6],
  [5.0, -0.4, 3.6, 1.1],
];
const NAMES = ["F1", "F2", "F3", "F4"];

describe("statistics", () => {
  it("computes mean and sample std of [2, 4, 6]", () => {
    expect(mean([2, 4, 6])).toBe(4);
    expect(std([2, 4, 6])).toBe(2);
  });

  it("matches the hand calculation of the 4x4 example", () => {
    const r = analyze(DATA, 1, NAMES);
    expect(r[0].mean).toBeCloseTo(4.925, 3);
    expect(r[0].std).toBeCloseTo(0.1708, 3);
    expect(r[0].index).toBeCloseTo(28.84, 1);
    expect(r[1].index).toBeCloseTo(0.165, 2);
    expect(r[2].index).toBeCloseTo(12.07, 1);
    expect(r[3].index).toBeCloseTo(0.138, 2);
    expect(r.map((x) => x.keep)).toEqual([true, false, true, false]);
  });

  it("gives a constant column an infinite index and keeps it", () => {
    const r = analyze([[1, 5], [2, 5], [3, 5]], 1, ["a", "b"]);
    expect(r[1].index).toBe(Infinity);
    expect(r[1].keep).toBe(true);
  });

  it("uses the average of the indices as the automatic threshold", () => {
    expect(autoThreshold(DATA, NAMES)).toBeCloseTo(10.3, 1);
  });
});
