import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Layout from "../../pages/layout/Layout";

const renderWithRouter = (initialPath = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="*"
            element={<div data-testid="outlet-content">Outlet Content</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("Layout Component", () => {
  it("renders page title", () => {
    renderWithRouter();
    expect(screen.getByText("Rewards Dashboard")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderWithRouter();

    expect(screen.getByText("User Monthly Rewards")).toBeInTheDocument();
    expect(screen.getByText("Total Rewards")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  it("marks User Monthly Rewards as active when route is '/'", () => {
    renderWithRouter("/");

    const firstLink = screen.getByText("User Monthly Rewards");

    expect(firstLink.className).toBe("active-link");
  });

  it("marks Total Rewards as active on '/total-rewards'", () => {
    renderWithRouter("/total-rewards");

    const link = screen.getByText("Total Rewards");
    expect(link.className).toBe("active-link");
  });

  it("marks Transactions as active on '/transactions'", () => {
    renderWithRouter("/transactions");

    const link = screen.getByText("Transactions");
    expect(link.className).toBe("active-link");
  });

  it("non-active links have 'nav-link' class", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/total-rewards" },
      writable: true,
    });

    renderWithRouter("/total-rewards");

    expect(screen.getByText("User Monthly Rewards").className).toBe("nav-link");
    expect(screen.getByText("Transactions").className).toBe("nav-link");
  });

  it("renders the outlet content", () => {
    renderWithRouter();

    expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
  });
});
