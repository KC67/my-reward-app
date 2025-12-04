import { renderHook } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";

import useFetchData from "../../hooks/useFetchData";
vi.mock("../../hooks/useFetchData");

describe("useFetchTransactionDetailsData (Vitest)", () => {
  const mockToday = new Date("2025-11-15");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("filters last 3 months and sorts descending", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
        { transactionId: "T3", date: "2025-09-20", price: 90 },
        { transactionId: "T4", date: "2025-08-25", price: 110 },
      ],
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.loading).toBe(false);
    expect(result.current.data.map((x) => x.transactionId)).toEqual([
      "T1",
      "T2",
      "T3",
    ]);
  });

  it("ignores invalid dates", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "invalid", price: 100 },
        { transactionId: "T2", date: "2025-11-01", price: 150 },
      ],
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].transactionId).toBe("T2");
  });

  it("for invalid data", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: { transactionId: "T1", date: "invalid", price: 100 },
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.data).toHaveLength(0);
  });

  it("filters correctly with custom date range", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
        { transactionId: "T3", date: "2025-09-20", price: 90 },
      ],
    });

    const from = "2025-10-01";
    const to = "2025-10-31";

    const { result } = renderHook(() =>
      useFetchTransactionDetailsData(from, to, true)
    );

    expect(result.current.data.map((x) => x.transactionId)).toEqual(["T2"]);
  });

  it("returns empty array if no data in custom date range", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
      ],
    });

    const from = "2025-09-01";
    const to = "2025-09-30";

    const { result } = renderHook(() =>
      useFetchTransactionDetailsData(from, to, true)
    );

    expect(result.current.data).toHaveLength(0);
  });

  it("returns empty array if from date is after to date", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
      ],
    });

    const from = "2025-11-30";
    const to = "2025-11-01";

    const { result } = renderHook(() =>
      useFetchTransactionDetailsData(from, to, true)
    );

    expect(result.current.data).toHaveLength(0);
  });

  it("returns empty array if applyFilter is true but dates are missing or invalid", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
      ],
    });

    const { result: r1 } = renderHook(() =>
      useFetchTransactionDetailsData(null, "2025-11-15", true)
    );
    const { result: r2 } = renderHook(() =>
      useFetchTransactionDetailsData("2025-10-01", null, true)
    );
    const { result: r3 } = renderHook(() =>
      useFetchTransactionDetailsData("invalid", "2025-11-15", true)
    );

    expect(r1.current.data).toHaveLength(0);
    expect(r2.current.data).toHaveLength(0);
    expect(r3.current.data).toHaveLength(0);
  });
});
