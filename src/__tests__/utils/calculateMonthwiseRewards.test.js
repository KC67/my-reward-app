import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculateMonthwiseRewards } from "../../utils/calculateMonthwiseRewards";
import * as rewardUtils from "../../utils/calculateRewardPoints";

describe("calculateMonthwiseRewards", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates monthly rewards for a single transaction", () => {
    const mockData = [
      { customerId: 1, name: "John", date: "2025-01-15", price: 120 },
    ];

    
    vi.spyOn(rewardUtils, "calculateRewardPoints").mockImplementation(
      (price) => price
    );

    const result = calculateMonthwiseRewards(mockData);

    expect(result).toEqual([
      {
        key: "1-Jan-2025",
        customerId: 1,
        name: "John",
        month: "Jan",
        year: 2025,
        rewardPoints: 120,
      },
    ]);
  });

  it("aggregates multiple transactions for same customer in the same month", () => {
    const mockData = [
      { customerId: 1, name: "John", date: "2025-01-10", price: 50 },
      { customerId: 1, name: "John", date: "2025-01-25", price: 70 },
    ];

    vi.spyOn(rewardUtils, "calculateRewardPoints").mockImplementation(
      (price) => price
    );

    const result = calculateMonthwiseRewards(mockData);

    expect(result).toEqual([
      {
        key: "1-Jan-2025",
        customerId: 1,
        name: "John",
        month: "Jan",
        year: 2025,
        rewardPoints: 50 + 70, 
      },
    ]);
  });

  it("handles multiple customers and months correctly", () => {
    const mockData = [
      { customerId: 1, name: "John", date: "2025-01-10", price: 50 },
      { customerId: 2, name: "Jane", date: "2025-01-15", price: 60 },
      { customerId: 1, name: "John", date: "2025-02-05", price: 30 },
    ];

    vi.spyOn(rewardUtils, "calculateRewardPoints").mockImplementation(
      (price) => price
    );

    const result = calculateMonthwiseRewards(mockData);

    expect(result).toEqual([
      {
        key: "1-Jan-2025",
        customerId: 1,
        name: "John",
        month: "Jan",
        year: 2025,
        rewardPoints: 50,
      },
      {
        key: "2-Jan-2025",
        customerId: 2,
        name: "Jane",
        month: "Jan",
        year: 2025,
        rewardPoints: 60,
      },
      {
        key: "1-Feb-2025",
        customerId: 1,
        name: "John",
        month: "Feb",
        year: 2025,
        rewardPoints: 30,
      },
    ]);
  });

  it("returns empty array if input data is empty", () => {
    const result = calculateMonthwiseRewards([]);
    expect(result).toEqual([]);
  });

  it("returns empty array if input data is invalid", () => {
    const result = calculateMonthwiseRewards("name");
    expect(result).toEqual([]);
  });

  it("returns empty array if all required data is missing", () => {
    const mockData = [
      { name: "John", date: "2025-01-10", price: 50 },
      { customerId: 2, date: "2025-01-15", price: 60 },
      { customerId: 1, name: "John", date: "20250205", price: 30 },
    ];
    const result = calculateMonthwiseRewards(mockData);
    expect(result).toEqual([]);
  });

  it("returns rewards point as 0 if price is not a number", () => {
    const mockData = [
      { customerId: 1, name: "John", date: "2025-01-10", price: "50" },
    ];
    const result = calculateMonthwiseRewards(mockData);
    expect(result).toEqual([
      {
        customerId: 1,
        key: "1-Jan-2025",
        month: "Jan",
        name: "John",
        rewardPoints: 0,
        year: 2025,
      },
    ]);
  });
});
