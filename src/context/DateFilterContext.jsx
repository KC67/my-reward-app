import { createContext, useReducer, useContext } from "react";

const DateFilterContext = createContext();

const initialState = {
  fromDate: "",
  toDate: "",
  active: false,
};

Object.freeze(initialState);

function dateFilterReducer(dateRangeFilterState, action) {
  switch (action.type) {
    case "SET_FROM":
      return { ...dateRangeFilterState, fromDate: action.payload };

    case "SET_TO":
      return { ...dateRangeFilterState, toDate: action.payload };

    case "APPLY":
      return {
        ...dateRangeFilterState,
        active: true,
        fromDate: action.payload.from,
        toDate: action.payload.to,
      };

    case "RESET":
      return initialState;

    default:
      return dateRangeFilterState;
  }
}

export const DateFilterProvider = ({ children }) => {
  const [dateRangeFilterState, dispatch] = useReducer(
    dateFilterReducer,
    initialState
  );
  return (
    <DateFilterContext.Provider value={{ dateRangeFilterState, dispatch }}>
      {children}
    </DateFilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDateFilter = () => useContext(DateFilterContext);
