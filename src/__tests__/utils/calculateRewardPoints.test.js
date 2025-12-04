import { describe, expect, it } from "vitest";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

describe("calculateRewardPoints", () => {
  it("returns 0 for price below 50", () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(25)).toBe(0);
    expect(calculateRewardPoints(49.99)).toBe(0);
  });

  it("returns correct points for price between 50 and 99", () => {
    expect(calculateRewardPoints(50)).toBe(0);
    expect(calculateRewardPoints(60)).toBe(10);
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(99.99)).toBe(49);
  });

  it("returns correct points for price 100 or more", () => {
    expect(calculateRewardPoints(100)).toBe(50);
    expect(calculateRewardPoints(120)).toBe(50 + (120 - 100) * 2);
    expect(calculateRewardPoints(150.5)).toBe(50 + (150 - 100) * 2);
  });

  it("handles decimal prices correctly", () => {
    expect(calculateRewardPoints(49.9)).toBe(0);
    expect(calculateRewardPoints(99.9)).toBe(49);
    expect(calculateRewardPoints(100.9)).toBe(50);
  });
});
