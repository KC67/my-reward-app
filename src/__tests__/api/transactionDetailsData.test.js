import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import useFetchData from "../../hooks/useFetchData";
import { filterAndSortTransactionData } from "../../utils/filterAndSortTransactionData";

vi.mock("../../hooks/useFetchData");
vi.mock("../../utils/filterAndSortTransactionData");

describe("useFetchTransactionDetailsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading and processed data", () => {
    const mockData = [
      { id: 1, amount: 100 },
      { id: 2, amount: 350 },
    ];

    useFetchData.mockReturnValue({
      data: mockData,
      loading: false,
    });

    filterAndSortTransactionData.mockReturnValue([
      { id: 2, amount: 350 },
      { id: 1, amount: 100 },
    ]);

    const { result } = renderHook(() =>
      useFetchTransactionDetailsData("2025-01-01", "2025-02-01", true)
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([
      { id: 2, amount: 350 },
      { id: 1, amount: 100 },
    ]);
  });

  it("should call filterAndSortTransactionData with correct arguments", () => {
    const mockData = [
      { id: 1, amount: 100 },
      { id: 2, amount: 350 },
    ];
    useFetchData.mockReturnValue({ data: mockData, loading: false });

    filterAndSortTransactionData.mockReturnValue([
      { id: 2, amount: 350 },
      { id: 1, amount: 100 },
    ]);

    const fromDate = "2025-01-01";
    const toDate = "2025-02-01";
    const applyFilter = true;

    renderHook(() =>
      useFetchTransactionDetailsData(fromDate, toDate, applyFilter)
    );

    expect(filterAndSortTransactionData).toHaveBeenCalledWith(
      mockData,
      fromDate,
      toDate,
      applyFilter
    );
  });

  it("should recompute when dependencies change", () => {
    const mockData = [
      { id: 1, amount: 100 },
      { id: 2, amount: 350 },
    ];
    useFetchData.mockReturnValue({ data: mockData, loading: false });

    filterAndSortTransactionData.mockReturnValue([{ id: 2, amount: 350 }]);

    const { result, rerender } = renderHook(
      ({ from, to, apply }) => useFetchTransactionDetailsData(from, to, apply),
      {
        initialProps: {
          from: "2025-01-01",
          to: "2025-02-01",
          apply: true,
        },
      }
    );

    expect(result.current.data).toEqual([{ id: 2, amount: 350 }]);

    filterAndSortTransactionData.mockReturnValue([{ id: 1, amount: 100 }]);

    rerender({
      from: "2025-01-10",
      to: "2025-02-01",
      apply: true,
    });

    expect(result.current.data).toEqual([{ id: 1, amount: 100 }]);
  });

  it("should return undefined when no data is fetched", () => {
    useFetchData.mockReturnValue({ data: null, loading: true });

    filterAndSortTransactionData.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      useFetchTransactionDetailsData("2025-01-01", "2025-02-01", false)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(undefined);
  });
});
