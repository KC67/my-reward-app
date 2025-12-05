import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { filterAndSortTransactionData } from "../../utils/filterAndSortTransactionData";

describe("filterAndSortTransactionData", () => {
  const mockToday = new Date("2025-11-15");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return empty array when data is not an array", () => {
    expect(filterAndSortTransactionData(null)).toEqual([]);
    expect(filterAndSortTransactionData(undefined)).toEqual([]);
    expect(filterAndSortTransactionData({})).toEqual([]);
    expect(filterAndSortTransactionData("string")).toEqual([]);
  });

  it("should return empty array when filtered result is empty", () => {
    const input = [{ id: 1, date: "2020-01-01" }];
    expect(filterAndSortTransactionData(input, null, null, false)).toEqual([]);
  });

  it("should filter last 3 months when applyFilter = false", () => {
    const input = [
      { id: 1, date: "2025-11-10" },
      { id: 2, date: "2025-09-01" },
      { id: 3, date: "2025-07-01" },
    ];

    const result = filterAndSortTransactionData(input, null, null, false);

    expect(result).toEqual([
      { id: 1, date: "2025-11-10" },
      { id: 2, date: "2025-09-01" },
    ]);
  });

  it("should exclude transactions with invalid dates", () => {
    const input = [
      { id: 1, date: "2025-11-10" },
      { id: 2, date: "invalid-date" },
    ];

    const result = filterAndSortTransactionData(input, null, null, false);

    expect(result.length).toBe(1);
    expect(result).toEqual([{ id: 1, date: "2025-11-10" }]);
  });

  it("should filter by date range when applyFilter = true", () => {
    const input = [
      { id: 1, date: "2025-10-01" },
      { id: 2, date: "2025-09-20" },
      { id: 3, date: "2025-08-15" },
    ];

    const result = filterAndSortTransactionData(
      input,
      "2025-09-01",
      "2025-10-10",
      true
    );

    expect(result).toEqual([
      { id: 1, date: "2025-10-01" },
      { id: 2, date: "2025-09-20" },
    ]);
  });

  it("should return empty array when fromDate or toDate is invalid", () => {
    const input = [{ id: 1, date: "2025-10-01" }];

    expect(
      filterAndSortTransactionData(input, "invalid", "2025-10-05", true)
    ).toEqual([]);

    expect(
      filterAndSortTransactionData(input, "2025-09-01", "invalid", true)
    ).toEqual([]);
  });

  it("should return [] if from > to when applyFilter = true", () => {
    const input = [{ id: 1, date: "2025-10-01" }];

    const result = filterAndSortTransactionData(
      input,
      "2025-10-10",
      "2025-09-01",
      true
    );

    expect(result).toEqual([]);
  });

  it("should sort results in descending date order", () => {
    const input = [
      { id: 1, date: "2025-10-01" },
      { id: 2, date: "2025-10-10" },
      { id: 3, date: "2025-09-15" },
    ];

    const result = filterAndSortTransactionData(
      input,
      "2025-09-01",
      "2025-10-15",
      true
    );

    expect(result).toEqual([
      { id: 2, date: "2025-10-10" },
      { id: 1, date: "2025-10-01" },
      { id: 3, date: "2025-09-15" },
    ]);
  });

  it("should ignore applyFilter = false and use last 3 months logic", () => {
    const input = [
      { id: 1, date: "2025-11-01" },
      { id: 2, date: "2025-08-25" },
    ];

    const result = filterAndSortTransactionData(input, null, null, false);

    expect(result).toEqual([{ id: 1, date: "2025-11-01" }]);
  });

  it("should handle future dates when applyFilter = false", () => {
    const input = [
      { id: 1, date: "2025-12-01" },
      { id: 2, date: "2025-11-10" },
    ];

    const result = filterAndSortTransactionData(input, null, null, false);

    expect(result).toEqual([{ id: 2, date: "2025-11-10" }]);
  });

  it("should handle missing date field gracefully", () => {
    const input = [
      { id: 1 },
      { id: 2, date: null },
      { id: 3, date: "2025-10-10" },
    ];

    const result = filterAndSortTransactionData(input, null, null, false);

    expect(result).toEqual([{ id: 3, date: "2025-10-10" }]);
  });
});
