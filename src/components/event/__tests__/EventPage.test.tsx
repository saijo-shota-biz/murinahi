import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventPage } from "../EventPage";
import type { Event } from "@/app/model/Event";

// Mock the useEventState hook
vi.mock("@/hooks/useEventState", () => ({
  useEventState: vi.fn(() => ({
    userId: "test-user-id",
    selectedDates: new Set(["2024-01-15"]),
    isSaving: false,
    showSaveSuccess: false,
    saveError: null,
    handleDateClick: vi.fn(),
    getNGCountForDate: vi.fn(() => 0),
  })),
}));

describe("EventPage", () => {
  const mockEvent: Event = {
    id: "test-event-id",
    title: "Test Event",
    participants: {
      "user-1": { ng_dates: ["2024-01-10"] },
      "user-2": { ng_dates: ["2024-01-11"] },
    },
    createdAt: "2024-01-01T00:00:00Z",
  };

  it("should render event header with title", () => {
    render(<EventPage event={mockEvent} />);
    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("should render event header without title when not provided", () => {
    const eventWithoutTitle = { ...mockEvent, title: undefined };
    render(<EventPage event={eventWithoutTitle} />);

    // Should still render the instruction text
    expect(screen.getByText("参加できない日")).toBeInTheDocument();
    expect(screen.getByText("をタップしてください")).toBeInTheDocument();
  });

  it("should render month tabs", () => {
    render(<EventPage event={mockEvent} />);

    const currentMonth = new Date().getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    expect(screen.getByText(`${currentMonth}月`)).toBeInTheDocument();
    expect(screen.getByText(`${nextMonth}月`)).toBeInTheDocument();
  });

  it("should render calendar component", () => {
    render(<EventPage event={mockEvent} />);

    // Check for calendar navigation buttons
    expect(screen.getByTitle("前の月へ")).toBeInTheDocument();
    expect(screen.getByTitle("次の月へ")).toBeInTheDocument();

    // Check for weekday headers
    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("月")).toBeInTheDocument();
    expect(screen.getByText("火")).toBeInTheDocument();
  });

  it("should render event summary", () => {
    render(<EventPage event={mockEvent} />);

    expect(screen.getByText("集計")).toBeInTheDocument();
    expect(screen.getByText("2名")).toBeInTheDocument(); // 2 participants

    // Use partial text matching for the compound text
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "現在 2名 が参加中";
      }),
    ).toBeInTheDocument();
  });

  it("should render share section", () => {
    render(<EventPage event={mockEvent} />);

    expect(screen.getByText("このURLを共有してメンバーを招待")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /URLをコピー/ })).toBeInTheDocument();
  });

  it("should have proper layout classes", () => {
    const { container } = render(<EventPage event={mockEvent} />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("min-h-screen", "bg-gradient-to-br", "from-red-50", "via-pink-50", "to-orange-50");

    const contentDiv = mainDiv.querySelector(".relative.z-10");
    expect(contentDiv).toHaveClass("max-w-4xl", "mx-auto", "px-4", "py-8");
  });
});
