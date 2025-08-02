import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard } from "../FeatureCard";

describe("FeatureCard", () => {
  const mockProps = {
    icon: <div data-testid="test-icon">Icon</div>,
    title: "Test Feature",
    description: "This is a test feature description",
    iconBgColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
  };

  it("should render all provided content", () => {
    render(<FeatureCard {...mockProps} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    expect(screen.getByText("This is a test feature description")).toBeInTheDocument();
  });

  it("should have proper card styling", () => {
    render(<FeatureCard {...mockProps} />);

    const card = screen.getByText("Test Feature").closest("div");
    expect(card).toHaveClass(
      "rounded-xl",
      "shadow-lg",
      "bg-white/60",
      "backdrop-blur-sm",
      "p-6",
      "hover:shadow-xl",
      "transition-shadow",
      "duration-300",
    );
  });

  it("should render icon with proper styling", () => {
    render(<FeatureCard {...mockProps} />);

    const iconContainer = screen.getByTestId("test-icon").parentElement?.parentElement;
    expect(iconContainer).toHaveClass(
      "w-12",
      "h-12",
      "bg-blue-100",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      "mb-4",
      "mx-auto",
    );
  });

  it("should render title as h3 with proper styling", () => {
    render(<FeatureCard {...mockProps} />);

    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("Test Feature");
    expect(title).toHaveClass("font-bold", "text-gray-800", "mb-2");
  });

  it("should render description with proper styling", () => {
    render(<FeatureCard {...mockProps} />);

    const description = screen.getByText("This is a test feature description");
    expect(description).toHaveClass("text-sm", "text-gray-600");
  });

  it("should handle long titles and descriptions", () => {
    const longProps = {
      icon: <div data-testid="long-icon">Icon</div>,
      title: "This is a very long feature title that might wrap to multiple lines",
      description:
        "This is a very long feature description that definitely should wrap to multiple lines and still look good in the card layout with proper spacing and typography",
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-500",
    };

    render(<FeatureCard {...longProps} />);

    expect(screen.getByText(longProps.title)).toBeInTheDocument();
    expect(screen.getByText(longProps.description)).toBeInTheDocument();
  });
});
