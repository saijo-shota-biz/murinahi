import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Calendar } from "../Calendar";

describe("Calendar", () => {
  const mockProps = {
    currentMonth: new Date(2024, 0, 1), // January 2024
    onMonthChange: vi.fn(),
    selectedDates: new Set(["2024-01-15", "2024-01-20"]),
    onDateClick: vi.fn(),
    getNGCountForDate: vi.fn(() => 0),
    userId: "test-user-id",
    participantName: "",
    onNameChange: vi.fn(),
    inputCompleted: false,
    onInputCompletedChange: vi.fn(),
    isSaving: false,
    showSaveSuccess: false,
    saveError: null,
  };

  it("should render calendar navigation", () => {
    render(<Calendar {...mockProps} />);

    expect(screen.getByTitle("前の月へ")).toBeInTheDocument();
    expect(screen.getByTitle("次の月へ")).toBeInTheDocument();
    expect(screen.getByText("2024年1月")).toBeInTheDocument();
  });

  it("should render calendar grid with weekday headers", () => {
    render(<Calendar {...mockProps} />);

    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("月")).toBeInTheDocument();
    expect(screen.getByText("火")).toBeInTheDocument();
    expect(screen.getByText("水")).toBeInTheDocument();
    expect(screen.getByText("木")).toBeInTheDocument();
    expect(screen.getByText("金")).toBeInTheDocument();
    expect(screen.getByText("土")).toBeInTheDocument();
  });

  it("should render calendar status when not saving", () => {
    render(<Calendar {...mockProps} />);

    // Status should be hidden when not saving and no success/error
    expect(screen.queryByText("保存中...")).not.toBeInTheDocument();
  });

  it("should render saving status", () => {
    render(<Calendar {...mockProps} isSaving={true} />);

    expect(screen.getByText("保存中...")).toBeInTheDocument();
  });

  it("should render success status", () => {
    render(<Calendar {...mockProps} showSaveSuccess={true} />);

    expect(screen.getByText("保存しました")).toBeInTheDocument();
  });

  it("should render error status", () => {
    const errorMessage = "保存に失敗しました";
    render(<Calendar {...mockProps} saveError={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should have proper container styling", () => {
    const { container } = render(<Calendar {...mockProps} />);

    const calendarContainer = container.firstChild as HTMLElement;
    expect(calendarContainer).toHaveClass("bg-white", "rounded-xl", "shadow-lg", "p-6");
  });

  it("should pass props to sub-components", () => {
    const mockGetNGCount = vi.fn(() => 2);
    const mockOnDateClick = vi.fn();
    const mockOnMonthChange = vi.fn();

    render(
      <Calendar
        {...mockProps}
        getNGCountForDate={mockGetNGCount}
        onDateClick={mockOnDateClick}
        onMonthChange={mockOnMonthChange}
      />,
    );

    // Verify that the calendar renders with the expected data
    expect(mockGetNGCount).toHaveBeenCalled();
  });
});
