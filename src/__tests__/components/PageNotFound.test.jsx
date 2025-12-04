import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PageNotFound from "../../components/error/PageNotFound";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockedNavigate = vi.fn();

describe("PageNotFound Component", () => {
  it("renders the 404 title", () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the message text", () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("renders the Go Back Home button", () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /go back home/i })
    ).toBeInTheDocument();
  });

  it("navigates to home on button click", () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /go back home/i }));

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
