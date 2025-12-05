import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import dayjs from "dayjs";
import DateRangeFilter from "../../components/dateRangeFilter/DateRangeFilter";

const mockDispatch = vi.fn();

const mockContextValue = {
  dateRangeFilterState: { fromDate: null, toDate: null },
  dispatch: mockDispatch,
};

vi.mock("../../context/DateFilterContext", () => ({
  useDateFilter: () => mockContextValue,
}));

vi.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: ({ label, value, onChange }) => {
    return (
      <input
        data-testid={label.toLowerCase() + "-input"}
        value={value ? value.format("YYYY-MM-DD") : ""}
        onChange={(e) => onChange(dayjs(e.target.value))}
      />
    );
  },
}));

describe("DateRangeFilter", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders From & To fields", () => {
    render(<DateRangeFilter />);
    expect(screen.getByTestId("from-input")).toBeInTheDocument();
    expect(screen.getByTestId("to-input")).toBeInTheDocument();
  });

  it("Apply button disabled initially", () => {
    render(<DateRangeFilter />);
    expect(screen.getByTestId("apply-button")).toBeDisabled();
  });

  it("Reset button disabled initially", () => {
    render(<DateRangeFilter />);
    expect(screen.getByTestId("reset-button")).toBeDisabled();
  });

  it("selecting From enables To field", () => {
    render(<DateRangeFilter />);

    const fromInput = screen.getByTestId("from-input");
    const toInput = screen.getByTestId("to-input");

    fireEvent.change(fromInput, { target: { value: "2024-01-10" } });

    expect(toInput).not.toBeDisabled();
  });

  it("Apply dispatches APPLY with correct payload", () => {
    render(<DateRangeFilter />);

    const fromInput = screen.getByTestId("from-input");
    const toInput = screen.getByTestId("to-input");

    fireEvent.change(fromInput, { target: { value: "2024-01-10" } });
    fireEvent.change(toInput, { target: { value: "2024-01-20" } });

    fireEvent.click(screen.getByTestId("apply-button"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "APPLY",
      payload: {
        from: "2024-01-10",
        to: "2024-01-20",
      },
    });
  });

  it("Reset clears dates and dispatches RESET", () => {
    render(<DateRangeFilter />);

    const fromInput = screen.getByTestId("from-input");

    fireEvent.change(fromInput, { target: { value: "2024-01-10" } });

    fireEvent.click(screen.getByTestId("reset-button"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "RESET",
    });
  });
});
