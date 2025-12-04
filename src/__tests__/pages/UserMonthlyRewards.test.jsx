import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import { DateFilterProvider } from "../../context/DateFilterContext";
import UserMonthlyRewards from "../../pages/userMonthlyRewards/UserMonthlyRewards";
import { calculateMonthwiseRewards } from "../../utils/calculateMonthwiseRewards";

vi.mock("../../api/transactionDetailsData", () => ({
  useFetchTransactionDetailsData: vi.fn(),
}));

vi.mock("../../utils/calculateMonthwiseRewards", () => ({
  calculateMonthwiseRewards: vi.fn(),
}));

vi.mock("../../components/loader/LoadingSpinner", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../components/table/Table", () => ({
  default: ({ columns, data }) => (
    <table data-testid="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe("UserMonthlyRewards Component", () => {
  const renderWithContext = (ui, { providerProps, ...renderOptions } = {}) => {
    return render(
      <DateFilterProvider {...providerProps}>{ui}</DateFilterProvider>,
      renderOptions
    );
  };

  it("shows loading spinner when loading=true", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: [],
      loading: true,
    });

    renderWithContext(<UserMonthlyRewards />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders table after data is loaded", () => {
    const fakeApiData = [
      { customerId: 1, name: "John", date: "2024-05-01", price: 120 },
      { customerId: 1, name: "John", date: "2024-05-20", price: 90 },
    ];

    const fakeMonthlyRewards = [
      {
        customerId: 1,
        name: "John",
        month: "May",
        year: 2024,
        rewardPoints: 150,
      },
    ];

    useFetchTransactionDetailsData.mockReturnValue({
      data: fakeApiData,
      loading: false,
    });

    calculateMonthwiseRewards.mockReturnValue(fakeMonthlyRewards);

    renderWithContext(<UserMonthlyRewards />);

    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("Customer Id")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();
  });

  it("renders empty array correctly when no data", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: [],
      loading: false,
    });

    calculateMonthwiseRewards.mockReturnValue([]);

    renderWithContext(<UserMonthlyRewards />);

    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    expect(table.querySelectorAll("tbody tr")).toHaveLength(0);
  });
  it("handles undefined rewardsData without crashing", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: undefined,
      loading: false,
    });

    renderWithContext(<UserMonthlyRewards />);

    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();
    expect(table.querySelectorAll("tbody tr")).toHaveLength(0);
  });
});
