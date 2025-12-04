import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingSpinner from "../../components/loader/LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("renders the spinner container", () => {
    render(<LoadingSpinner />);
    const container = document.querySelector(".spinner-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the spinner element", () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("spinner container contains spinner element", () => {
    render(<LoadingSpinner />);
    const container = document.querySelector(".spinner-container");
    const spinner = document.querySelector(".spinner");
    expect(container).toContainElement(spinner);
  });
});
