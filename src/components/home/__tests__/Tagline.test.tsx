import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tagline } from "../Tagline";

describe("Tagline", () => {
  it("should render the tagline text", () => {
    render(<Tagline />);
    // Text parts are rendered correctly (text is split by br tag and span)
    expect(screen.getByText(/参加できない日だけ選ぶ/)).toBeInTheDocument();
    expect(screen.getByText("逆転の発想")).toBeInTheDocument();
    expect(screen.getByText(/で最速調整/)).toBeInTheDocument();
  });

  it("should have proper styling classes", () => {
    render(<Tagline />);
    const paragraph = screen.getByText("逆転の発想").closest("p");
    expect(paragraph).toHaveClass(
      "text-lg",
      "sm:text-xl",
      "md:text-2xl",
      "text-gray-700",
      "mb-8",
      "sm:mb-12",
      "leading-relaxed",
      "animate-fade-in-up",
      "px-4",
    );
  });

  it("should have highlighted text with proper styling", () => {
    render(<Tagline />);
    const highlight = screen.getByText("逆転の発想");
    expect(highlight).toHaveClass("font-bold", "text-red-500");
  });

  it("should be wrapped in a paragraph element", () => {
    render(<Tagline />);
    const paragraph = screen.getByText("逆転の発想").closest("p");
    expect(paragraph?.tagName).toBe("P");
  });
});
