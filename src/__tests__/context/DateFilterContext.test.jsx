import { describe, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  DateFilterProvider,
  useDateFilter,
} from "../../context/DateFilterContext";

const initialState = {
  fromDate: "",
  toDate: "",
  active: false,
};

describe("DateFilterContext reducer + provider tests", () => {
  test("initial state is returned from provider", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    expect(result.current.state).toEqual(initialState);
  });

  test("SET_FROM updates fromDate", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    act(() => {
      result.current.dispatch({
        type: "SET_FROM",
        payload: "2025-01-01",
      });
    });

    expect(result.current.state.fromDate).toBe("2025-01-01");
  });

  test("SET_TO updates toDate", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    act(() => {
      result.current.dispatch({
        type: "SET_TO",
        payload: "2025-02-01",
      });
    });

    expect(result.current.state.toDate).toBe("2025-02-01");
  });

  test("APPLY sets active = true and updates both dates", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    act(() => {
      result.current.dispatch({
        type: "APPLY",
        payload: {
          from: "2025-01-10",
          to: "2025-01-20",
        },
      });
    });

    expect(result.current.state).toEqual({
      fromDate: "2025-01-10",
      toDate: "2025-01-20",
      active: true,
    });
  });

  test("RESET clears state back to initial", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    act(() => {
      result.current.dispatch({
        type: "APPLY",
        payload: {
          from: "2025-01-01",
          to: "2025-01-15",
        },
      });
    });

    act(() => {
      result.current.dispatch({ type: "RESET" });
    });

    expect(result.current.state).toEqual(initialState);
  });

  test("unknown action returns same state", () => {
    const { result } = renderHook(() => useDateFilter(), {
      wrapper: DateFilterProvider,
    });

    const before = result.current.state;

    act(() => {
      result.current.dispatch({ type: "UNKNOWN" });
    });

    expect(result.current.state).toEqual(before);
  });
});
