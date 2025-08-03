import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceShareButton } from "../ServiceShareButton";

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

// Mock navigator.share
const mockNavigatorShare = vi.fn(() => Promise.resolve());

describe("ServiceShareButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });
    expect(button).toBeInTheDocument();
  });

  it("should open Twitter share when clicked on desktop", () => {
    // Simulate desktop environment (no navigator.share)
    delete (navigator as any).share;

    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should use Web Share API when available on mobile", async () => {
    // Simulate mobile environment with navigator.share
    Object.defineProperty(navigator, "share", {
      value: mockNavigatorShare,
      configurable: true,
    });

    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    // Wait for async operation
    await vi.waitFor(() => {
      expect(mockNavigatorShare).toHaveBeenCalled();
    });
  });

  it("should handle Web Share API cancellation gracefully", async () => {
    const mockError = new Error("User cancelled");
    mockError.name = "AbortError";
    const mockShare = vi.fn(() => Promise.reject(mockError));

    Object.defineProperty(navigator, "share", {
      value: mockShare,
      configurable: true,
    });

    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    await vi.waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });

    // Should not throw or show any error
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("should accept custom url and title props", () => {
    const customUrl = "https://example.com/event/123";

    delete (navigator as any).share;

    render(<ServiceShareButton url={customUrl} />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(customUrl)),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should apply variant and size props", () => {
    render(<ServiceShareButton variant="primary" size="lg" />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("should apply custom className", () => {
    render(<ServiceShareButton className="custom-class" />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    expect(button).toHaveClass("custom-class");
  });
});