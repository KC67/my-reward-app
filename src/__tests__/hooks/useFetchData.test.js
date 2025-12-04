import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useFetchData from "../../hooks/useFetchData";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useFetchData hook", () => {
  const fakeUrl = "https://api.example.com/data";

  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  it("fetches data successfully", async () => {
    const fakeData = [{ id: 1, name: "John" }];

    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeData),
      })
    );

    const { result } = renderHook(() => useFetchData(fakeUrl), {
      wrapper: MemoryRouter,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(fakeData);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /404 on non-ok response", async () => {
    window.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    const { result } = renderHook(() => useFetchData(fakeUrl), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith("/404", { replace: true });
  });

  it("navigates to /404 on network error", async () => {
    window.fetch = vi.fn(() => Promise.reject("Network error"));

    const { result } = renderHook(() => useFetchData(fakeUrl), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith("/404", { replace: true });
  });
});
