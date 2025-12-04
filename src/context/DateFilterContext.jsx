import { createContext, useReducer, useContext } from "react";

const DateFilterContext = createContext();

const initialState = {
  fromDate: "",
  toDate: "",
  active: false,
};

function dateFilterReducer(state, action) {
  switch (action.type) {
    case "SET_FROM":
      return { ...state, fromDate: action.payload };

    case "SET_TO":
      return { ...state, toDate: action.payload };

    case "APPLY":
      return {
        ...state,
        active: true,
        fromDate: action.payload.from,
        toDate: action.payload.to,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export const DateFilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dateFilterReducer, initialState);
  return (
    <DateFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </DateFilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDateFilter = () => useContext(DateFilterContext);
