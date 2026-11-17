import { describe, expect, it } from "vitest";
import { MAX_COLS, parseCsv, randomCells, toCsv } from "./data";

describe("data helpers", () => {
  it("parses a CSV with a header", () => {
    expect(parseCsv("a,b\n1,2\n3,4")).toEqual({ names: ["a", "b"], cells: [["1", "2"], ["3", "4"]] });
  });
  it("parses a CSV without a header", () => {
    expect(parseCsv("1;2\n3;4")?.names).toEqual(["F1", "F2"]);
  });
  it("limits the number of columns", () => {
    const wide = Array.from({ length: 20 }, (_, i) => i).join(",");
    expect(parseCsv(wide)?.names.length).toBe(MAX_COLS);
  });
  it("keeps random values between -100 and 100", () => {
    const all = randomCells(50, 6).flat().map(Number);
    expect(all.every((x) => x >= -100 && x <= 100)).toBe(true);
  });
  it("writes a CSV", () => {
    expect(toCsv(["a", "b"], [[1, 2]])).toBe("a,b\n1,2");
  });
});
