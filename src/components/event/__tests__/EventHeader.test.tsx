import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventHeader } from "../EventHeader";
import type { Event } from "@/app/model/Event";

describe("EventHeader", () => {
  const mockEvent: Event = {
    id: "test-event-id",
    title: "Test Event Title",
    participants: {},
    createdAt: "2024-01-01T00:00:00Z",
  };

  it("should render event title when provided", () => {
    render(<EventHeader event={mockEvent} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Test Event Title");
    expect(title).toHaveClass("text-2xl", "md:text-3xl", "font-bold", "text-gray-800", "mb-4");
  });

  it("should not render title when not provided", () => {
    const eventWithoutTitle = { ...mockEvent, title: undefined };
    render(<EventHeader event={eventWithoutTitle} />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("should always render instruction text", () => {
    render(<EventHeader event={mockEvent} />);

    expect(screen.getByText("参加できない日")).toBeInTheDocument();
    expect(screen.getByText("をタップしてください")).toBeInTheDocument();

    const gradientSpan = screen.getByText("参加できない日");
    expect(gradientSpan).toHaveClass(
      "bg-gradient-to-r",
      "from-red-500",
      "to-pink-500",
      "bg-clip-text",
      "text-transparent",
      "font-bold",
    );
  });

  it("should have proper container styling", () => {
    render(<EventHeader event={mockEvent} />);

    const container = screen.getByText("参加できない日").closest("div");
    expect(container).toHaveClass("text-center", "mb-8");
  });

  it("should have proper instruction text styling", () => {
    render(<EventHeader event={mockEvent} />);

    const instruction = screen.getByText("をタップしてください").closest("p");
    expect(instruction).toHaveClass("text-lg", "md:text-xl", "text-gray-600", "mb-2");
  });
});
