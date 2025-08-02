import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("should render with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
  });

  it("should apply variant classes correctly", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "text-gray-700", "border");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-600");

    rerender(<Button variant="primary">Primary</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
  });

  it("should apply size classes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-2", "text-sm");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "text-base");
  });

  it("should show loading spinner when loading", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    // Check for loading spinner
    const spinner = screen.getByTitle("読み込み中");
    expect(spinner).toBeInTheDocument();
  });

  it("should be disabled when loading or disabled prop is true", () => {
    const { rerender } = render(<Button loading>Loading</Button>);
    let button = screen.getByRole("button");
    expect(button).toBeDisabled();

    rerender(<Button disabled>Disabled</Button>);
    button = screen.getByRole("button");
    expect(button).toBeDisabled();

    rerender(
      <Button loading disabled>
        Both
      </Button>,
    );
    button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not trigger click when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should pass through additional props", () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-testid", "submit-btn");
  });
});
