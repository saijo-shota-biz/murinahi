import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventSummary } from "../EventSummary";
import type { Event } from "@/app/model/Event";

describe("EventSummary", () => {
  it("should render participant count correctly", () => {
    const mockEvent: Event = {
      id: "test-event-id",
      title: "Test Event",
      participants: {
        "user-1": { ng_dates: ["2024-01-10"] },
        "user-2": { ng_dates: ["2024-01-11"] },
        "user-3": { ng_dates: ["2024-01-12"] },
      },
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(<EventSummary event={mockEvent} />);

    expect(screen.getByText("集計")).toBeInTheDocument();
    expect(screen.getByText("3名")).toBeInTheDocument();

    // Check the full text content
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === "現在 3名 が参加中";
      }),
    ).toBeInTheDocument();
  });

  it("should render zero participants correctly", () => {
    const mockEvent: Event = {
      id: "test-event-id",
      title: "Test Event",
      participants: {},
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(<EventSummary event={mockEvent} />);

    expect(screen.getByText("0名")).toBeInTheDocument();
  });

  it("should render single participant correctly", () => {
    const mockEvent: Event = {
      id: "test-event-id",
      title: "Test Event",
      participants: {
        "user-1": { ng_dates: ["2024-01-10"] },
      },
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(<EventSummary event={mockEvent} />);

    expect(screen.getByText("1名")).toBeInTheDocument();
  });

  it("should render help text", () => {
    const mockEvent: Event = {
      id: "test-event-id",
      title: "Test Event",
      participants: {},
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(<EventSummary event={mockEvent} />);

    expect(screen.getByText("カレンダーの数字は、その日にNGな人数を表示しています")).toBeInTheDocument();
  });

  it("should have proper styling", () => {
    const mockEvent: Event = {
      id: "test-event-id",
      title: "Test Event",
      participants: {},
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(<EventSummary event={mockEvent} />);

    const container = screen.getByText("集計").closest("div");
    expect(container).toHaveClass("bg-white", "rounded-xl", "shadow-lg", "p-6", "mt-6");

    const title = screen.getByText("集計");
    expect(title).toHaveClass("text-lg", "font-bold", "text-gray-800", "mb-4");

    const participantCount = screen.getByText("0名");
    expect(participantCount).toHaveClass("font-bold", "text-gray-800");
  });
});
