import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("should render the main heading", () => {
    render(<HeroSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("ムリな日カレンダー");
  });

  it("should have gradient text styling", () => {
    render(<HeroSection />);
    const gradientSpan = screen.getByText("ムリな日");
    expect(gradientSpan).toHaveClass(
      "bg-clip-text",
      "text-transparent",
      "bg-gradient-to-r",
      "from-red-500",
      "to-pink-500",
    );
  });

  it("should have proper typography classes", () => {
    render(<HeroSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass(
      "text-3xl",
      "sm:text-5xl",
      "md:text-7xl",
      "font-black",
      "text-gray-800",
      "mb-2",
      "tracking-tight",
    );
  });

  it("should be semantic HTML", () => {
    render(<HeroSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.tagName).toBe("H1");
  });
});
