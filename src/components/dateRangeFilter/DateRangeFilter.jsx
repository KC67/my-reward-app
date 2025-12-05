import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { memo, useState } from "react";
import { useDateFilter } from "../../context/DateFilterContext";
import "./DateRangeFilter.css";

const DateRangeFilter = () => {
  const { dateRangeFilterState, dispatch } = useDateFilter();
  const today = dayjs();

  const [localFrom, setLocalFrom] = useState(
    dateRangeFilterState.fromDate ? dayjs(dateRangeFilterState.fromDate) : null
  );
  const [localTo, setLocalTo] = useState(
    dateRangeFilterState.toDate ? dayjs(dateRangeFilterState.toDate) : null
  );

  const handleApply = () => {
    dispatch({
      type: "APPLY",
      payload: {
        from: localFrom ? localFrom.format("YYYY-MM-DD") : "",
        to: localTo ? localTo.format("YYYY-MM-DD") : "",
      },
    });
  };

  const handleReset = () => {
    setLocalFrom(null);
    setLocalTo(null);
    dispatch({ type: "RESET" });
  };

  return (
    <div className="date-filter-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From"
          value={localFrom}
          onChange={(newVal) => {
            setLocalFrom(newVal);
            setLocalTo(null);
          }}
          maxDate={today}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="To"
          value={localTo}
          onChange={(newVal) => setLocalTo(newVal)}
          minDate={localFrom || null}
          maxDate={today}
          disabled={!localFrom}
          slotProps={{ textField: { size: "small" } }}
        />
      </LocalizationProvider>
      <Button
        variant="contained"
        onClick={handleApply}
        disabled={!(localFrom && localTo)}
        data-testid="apply-button"
      >
        Apply
      </Button>
      <Button
        variant="contained"
        onClick={handleReset}
        disabled={!(localFrom || localTo)}
        data-testid="reset-button"
      >
        Reset
      </Button>
    </div>
  );
};

export default memo(DateRangeFilter);
