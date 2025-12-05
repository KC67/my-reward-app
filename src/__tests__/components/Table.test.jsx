import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Table from "../../components/table/Table";

vi.mock("../../components/dateRangeFilter/DateRangeFilter", () => ({
  default: () => <div data-testid="date-range-filter" />,
}));

const columns = [
  { field: "name", label: "Name", flex: 1 },
  { field: "age", label: "Age", flex: 1 },
];

const data = [
  { name: "John Doe", age: 30 },
  { name: "Jane Smith", age: 25 },
  { name: "Alice Johnson", age: 35 },
];

describe("Table Component", () => {
  it("renders without crashing", () => {
    render(<Table columns={columns} data={data} />);
    expect(
      screen.getByLabelText(/filter by customer name/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("date-range-filter")).toBeInTheDocument();
  });

  it("renders correct number of rows initially", () => {
    render(<Table columns={columns} data={data} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(data.length + 1);
  });

  it("filters rows based on search input", () => {
    render(<Table columns={columns} data={data} />);
    const input = screen.getByLabelText(/filter by customer name/i);

    fireEvent.change(input, { target: { value: "Jane" } });

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(2);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("clears search input when backspace button is clicked", () => {
    render(<Table columns={columns} data={data} />);
    const input = screen.getByLabelText(/filter by customer name/i);
    const clearBtn = screen.getByTestId("clear-search-button");

    fireEvent.change(input, { target: { value: "Alice" } });
    expect(input.value).toBe("Alice");

    fireEvent.click(clearBtn);
    expect(input.value).toBe("");
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(data.length + 1);
  });

  it("disables clear button when search input is empty", () => {
    render(<Table columns={columns} data={data} />);
    const clearBtn = screen.getByTestId("clear-search-button");
    expect(clearBtn).toBeDisabled();
  });

  it("enables clear button when search input has value", () => {
    render(<Table columns={columns} data={data} />);
    const input = screen.getByLabelText(/filter by customer name/i);
    const clearBtn = screen.getByTestId("date-range-filter");

    fireEvent.change(input, { target: { value: "John" } });
    expect(clearBtn).not.toBeDisabled();
  });
});
