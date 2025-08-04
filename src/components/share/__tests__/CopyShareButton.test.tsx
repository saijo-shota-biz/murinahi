import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyShareButton } from "../CopyShareButton";

// Mock navigator.clipboard
const mockClipboardWriteText = vi.fn(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockClipboardWriteText,
  },
});

describe("CopyShareButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    render(<CopyShareButton />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });
    expect(button).toBeInTheDocument();
  });

  it("should copy share text to clipboard when clicked", async () => {
    render(<CopyShareButton />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockClipboardWriteText).toHaveBeenCalled();
    });
  });

  it("should show copied message after copying", async () => {
    render(<CopyShareButton />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("コピーしました！")).toBeInTheDocument();
    });
  });

  it("should include custom URL in copied text", async () => {
    const customUrl = "https://example.com/event/123";

    render(<CopyShareButton url={customUrl} />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockClipboardWriteText).toHaveBeenCalledWith(expect.stringContaining(customUrl));
    });
  });

  it("should apply variant and size props", () => {
    render(<CopyShareButton variant="primary" size="lg" />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });

    expect(button).toHaveClass("bg-gradient-to-r", "from-red-500", "to-pink-500");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("should apply custom className", () => {
    render(<CopyShareButton className="custom-class" />);
    const button = screen.getByRole("button", { name: /紹介文をコピー/i });

    expect(button).toHaveClass("custom-class");
  });
});
