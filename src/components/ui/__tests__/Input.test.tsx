import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  it("should render with default props", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("px-4", "py-3", "text-base");
  });

  it("should apply variant classes correctly", () => {
    const { rerender } = render(<Input variant="default" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-base");

    rerender(<Input variant="large" />);
    input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-base", "sm:text-lg");
  });

  it("should handle controlled input", () => {
    const handleChange = vi.fn();
    render(<Input value="test value" onChange={handleChange} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("test value");

    fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });

  it("should support different input types", () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);
    input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="number" />);
    input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
  });

  it("should pass through additional props", () => {
    render(<Input placeholder="Enter text" data-testid="test-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("data-testid", "test-input");
  });

  it("should handle focus and blur events", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("should have correct base styling", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "text-gray-800",
      "bg-white/80",
      "backdrop-blur-sm",
      "border-2",
      "border-gray-200",
      "rounded-xl",
      "transition-all",
      "duration-200",
    );
  });
});
