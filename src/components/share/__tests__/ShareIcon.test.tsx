import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShareIcon } from "../ShareIcon";

describe("ShareIcon", () => {
  it("should render SVG icon", () => {
    const { container } = render(<ShareIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("should apply custom className", () => {
    const { container } = render(<ShareIcon className="custom-icon-class" />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("custom-icon-class");
  });

  it("should have correct SVG structure", () => {
    const { container } = render(<ShareIcon />);
    const path = container.querySelector("path");

    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("fill", "currentColor");
  });
});
