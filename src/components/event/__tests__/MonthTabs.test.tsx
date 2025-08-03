import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MonthTabs } from "../MonthTabs";

describe("MonthTabs", () => {
  const mockOnMonthChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current date to be January 2024 for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 15)); // January 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render current month and next month tabs", () => {
    const currentMonth = new Date(2024, 0, 1); // January 2024
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    expect(screen.getByText("1月")).toBeInTheDocument();
    expect(screen.getByText("2月")).toBeInTheDocument();
  });

  it("should highlight active month tab", () => {
    const currentMonth = new Date(2024, 0, 1); // January 2024
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    const januaryTab = screen.getByText("1月");
    const februaryTab = screen.getByText("2月");

    // January should be active (highlighted)
    expect(januaryTab).toHaveClass("bg-red-500", "text-white", "shadow-md");

    // February should not be active
    expect(februaryTab).toHaveClass("bg-white", "text-gray-700");
  });

  it("should call onMonthChange when tab is clicked", () => {
    const currentMonth = new Date(2024, 0, 1); // January 2024
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    const februaryTab = screen.getByText("2月");

    fireEvent.click(februaryTab);

    expect(mockOnMonthChange).toHaveBeenCalledTimes(1);
    // Should be called with February date
    const calledWith = mockOnMonthChange.mock.calls[0][0];
    expect(calledWith.getMonth()).toBe(1); // February (0-indexed)
    expect(calledWith.getFullYear()).toBe(2024);
  });

  it("should have proper container styling", () => {
    const currentMonth = new Date(2024, 0, 1);
    const { container } = render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    const tabsContainer = container.firstChild as HTMLElement;
    expect(tabsContainer).toHaveClass("flex", "gap-2", "mb-4");
  });

  it("should have proper button styling", () => {
    const currentMonth = new Date(2024, 0, 1);
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    const januaryTab = screen.getByText("1月");
    expect(januaryTab).toHaveClass("px-4", "py-2", "rounded-lg", "font-medium", "transition-all", "duration-200");
  });

  it("should render different months when current date changes", () => {
    // Test with a different current date
    vi.setSystemTime(new Date(2024, 5, 15)); // June 15, 2024

    const currentMonth = new Date(2024, 5, 1); // June 2024
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    expect(screen.getByText("6月")).toBeInTheDocument();
    expect(screen.getByText("7月")).toBeInTheDocument();
  });

  it("should handle year boundary correctly", () => {
    // Test December -> January transition
    vi.setSystemTime(new Date(2024, 11, 15)); // December 15, 2024

    const currentMonth = new Date(2024, 11, 1); // December 2024
    render(<MonthTabs currentMonth={currentMonth} onMonthChange={mockOnMonthChange} />);

    expect(screen.getByText("12月")).toBeInTheDocument();
    expect(screen.getByText("1月")).toBeInTheDocument(); // Should show January of next year
  });
});
