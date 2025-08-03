import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceShareButton } from "../ServiceShareButton";

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

// Mock navigator.clipboard
const mockClipboardWriteText = vi.fn(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockClipboardWriteText,
  },
});

describe("ServiceShareButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });
    expect(button).toBeInTheDocument();
  });

  it("should open Twitter share when clicked normally", () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should copy to clipboard when Alt/Cmd key is pressed", async () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    // Simulate Alt+Click
    fireEvent.click(button, { altKey: true });

    await vi.waitFor(() => {
      expect(mockClipboardWriteText).toHaveBeenCalled();
    });
    
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("should show copied message after copying", async () => {
    render(<ServiceShareButton />);
    const button = screen.getByRole("button", { name: /ムリな日カレンダーを友達に教える/i });

    fireEvent.click(button, { metaKey: true });

    await vi.waitFor(() => {
      expect(screen.getByText("コピーしました！")).toBeInTheDocument();
    });
  });

  it("should accept custom url props", () => {
    const customUrl = "https://example.com/event/123";

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