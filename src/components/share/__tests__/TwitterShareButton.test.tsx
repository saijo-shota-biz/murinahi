import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TwitterShareButton } from "../TwitterShareButton";

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe("TwitterShareButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    render(<TwitterShareButton />);
    const button = screen.getByRole("button", { name: /Xでシェア/i });
    expect(button).toBeInTheDocument();
  });

  it("should open Twitter share when clicked", () => {
    render(<TwitterShareButton />);
    const button = screen.getByRole("button", { name: /Xでシェア/i });

    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should include custom URL in tweet", () => {
    const customUrl = "https://example.com/event/123";

    render(<TwitterShareButton url={customUrl} />);
    const button = screen.getByRole("button", { name: /Xでシェア/i });

    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(customUrl)),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should apply variant and size props", () => {
    render(<TwitterShareButton variant="primary" size="lg" />);
    const button = screen.getByRole("button", { name: /Xでシェア/i });

    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("should apply custom className", () => {
    render(<TwitterShareButton className="custom-class" />);
    const button = screen.getByRole("button", { name: /Xでシェア/i });

    expect(button).toHaveClass("custom-class");
  });
});
