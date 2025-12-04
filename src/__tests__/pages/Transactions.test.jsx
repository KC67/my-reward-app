import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import { DateFilterProvider } from "../../context/DateFilterContext";
import Transactions from "../../pages/transactions/Transactions";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

vi.mock("../../api/transactionDetailsData", () => ({
  useFetchTransactionDetailsData: vi.fn(),
}));

vi.mock("../../utils/calculateRewardPoints", () => ({
  calculateRewardPoints: vi.fn(),
}));

vi.mock("../../components/table/Table", () => ({
  __esModule: true,
  default: ({ columns, data }) => (
    <div
      data-testid="table"
      data-columns={JSON.stringify(columns)}
      data-rows={JSON.stringify(data)}
    />
  ),
}));

vi.mock("../../components/loader/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("Transactions Component", () => {
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

    renderWithContext(<Transactions />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
  });

  it("renders table with transformed transactions", () => {
    const mockApiData = [
      {
        transactionId: "T001",
        name: "Alice",
        date: "2025-01-10",
        product: "Mouse",
        price: 120,
      },
      {
        transactionId: "T002",
        name: "Bob",
        date: "2025-01-11",
        product: "Keyboard",
        price: 80,
      },
    ];

    calculateRewardPoints.mockReturnValueOnce(90).mockReturnValueOnce(30);

    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: mockApiData,
    });

    renderWithContext(<Transactions />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(rows).toEqual([
      {
        id: "T001",
        customerName: "Alice",
        date: "2025-01-10",
        product: "Mouse",
        price: 120,
        rewardPoints: 90,
      },
      {
        id: "T002",
        customerName: "Bob",
        date: "2025-01-11",
        product: "Keyboard",
        price: 80,
        rewardPoints: 30,
      },
    ]);
  });

  it("passes correct columns to Table", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: [],
    });

    renderWithContext(<Transactions />);

    const table = screen.getByTestId("table");

    const columns = JSON.parse(table.getAttribute("data-columns"));

    expect(columns).toEqual([
      { field: "id", label: "Transaction ID", flex: 1 },
      { field: "customerName", label: "Customer Name", flex: 2 },
      { field: "date", label: "Purchase Date", flex: 1 },
      { field: "product", label: "Product Purchased", flex: 2 },
      { field: "price", label: "Price", flex: 1 },
      { field: "rewardPoints", label: "Reward Points", flex: 1 },
    ]);
  });

  it("handles undefined rewardsData without crashing", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: undefined,
      loading: false,
    });

    renderWithContext(<Transactions />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(table).toBeInTheDocument();
    expect(rows).toHaveLength(0);
  });
});
