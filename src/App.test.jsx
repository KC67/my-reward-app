import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./routes/AppRoutes", () => ({
  default: () => <div data-testid="app-routes">Mocked AppRoutes</div>,
}));

describe("App Component", () => {
  it("renders the app container", () => {
    render(<App />);
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
  });

  it("renders AppRoutes inside App", () => {
    render(<App />);
    expect(screen.getByTestId("app-routes")).toBeInTheDocument();
  });
});
