import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import { DateFilterProvider } from "../../context/DateFilterContext";
import TotalRewards from "../../pages/totalRewards/TotalRewards";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

vi.mock("../../api/transactionDetailsData", () => ({
  useFetchTransactionDetailsData: vi.fn(),
}));
vi.mock("../../utils/calculateRewardPoints", () => ({
  calculateRewardPoints: vi.fn(),
}));

vi.mock("../../components/table/Table", () => ({
  default: ({ columns, data }) => (
    <div
      data-testid="table"
      data-columns={JSON.stringify(columns)}
      data-rows={JSON.stringify(data)}
    />
  ),
}));

vi.mock("../../components/loader/LoadingSpinner", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("TotalRewards Component", () => {
  const renderWithContext = (ui, { providerProps, ...renderOptions } = {}) => {
    return render(
      <DateFilterProvider {...providerProps}>{ui}</DateFilterProvider>,
      renderOptions
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loader when loading = true", () => {
    useFetchTransactionDetailsData.mockReturnValue({ loading: true, data: [] });

    renderWithContext(<TotalRewards />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
  });

  it("renders table with merged reward points", () => {
    const mockApiData = [
      { name: "Alice", price: 120 },
      { name: "Bob", price: 80 },
      { name: "Alice", price: 60 },
    ];

    calculateRewardPoints
      .mockReturnValueOnce(90)
      .mockReturnValueOnce(30)
      .mockReturnValueOnce(10);

    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: mockApiData,
    });

    renderWithContext(<TotalRewards />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(rows).toEqual([
      { customerName: "Alice", rewardPoints: 100 },
      { customerName: "Bob", rewardPoints: 30 },
    ]);
  });

  it("passes correct columns to Table", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: [],
    });

    renderWithContext(<TotalRewards />);

    const table = screen.getByTestId("table");
    const columns = JSON.parse(table.getAttribute("data-columns"));

    expect(columns).toEqual([
      { field: "customerName", label: "Customer Name", flex: 1 },
      { field: "rewardPoints", label: "Reward Points", flex: 1 },
    ]);
  });

  it("handles undefined rewardsData without crashing", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: undefined,
      loading: false,
    });

    renderWithContext(<TotalRewards />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(table).toBeInTheDocument();
    expect(rows).toHaveLength(0);
  });
});
