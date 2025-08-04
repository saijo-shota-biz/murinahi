import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareSection } from "../ShareSection";

// Mock the custom hooks
vi.mock("@/hooks/useClipboard", () => ({
  useClipboard: vi.fn(),
}));

vi.mock("@/hooks/useClipboardSupport", () => ({
  useClipboardSupport: vi.fn(),
}));

describe("ShareSection", () => {
  const mockCopyToClipboard = vi.fn();
  const mockUseClipboard = vi.fn();
  const mockUseClipboardSupport = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock window.location.href
    Object.defineProperty(window, "location", {
      value: {
        href: "https://example.com/event/123",
      },
      writable: true,
    });

    // Mock alert
    global.alert = vi.fn();

    // Default mock implementations
    mockUseClipboard.mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      justCopied: false,
    });

    mockUseClipboardSupport.mockReturnValue({
      clipboardSupported: true,
    });

    // Apply mocks
    const { useClipboard } = await import("@/hooks/useClipboard");
    const { useClipboardSupport } = await import("@/hooks/useClipboardSupport");

    vi.mocked(useClipboard).mockImplementation(mockUseClipboard);
    vi.mocked(useClipboardSupport).mockImplementation(mockUseClipboardSupport);
  });

  it("should render share section when clipboard is supported", () => {
    render(<ShareSection />);

    expect(screen.getByText("このURLを共有してメンバーを招待")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /URLをコピー/ })).toBeInTheDocument();
  });

  it("should not render when clipboard is not supported", () => {
    mockUseClipboardSupport.mockReturnValue({
      clipboardSupported: false,
    });

    const { container } = render(<ShareSection />);

    expect(container.firstChild).toBeNull();
  });

  it("should show 'コピーしました！' when just copied", () => {
    mockUseClipboard.mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      justCopied: true,
    });

    render(<ShareSection />);

    expect(screen.getByText("コピーしました！")).toBeInTheDocument();
    // The button still exists but text content changes
    expect(screen.getByRole("button", { name: /コピーしました！/ })).toBeInTheDocument();
  });

  it("should copy URL when button is clicked", async () => {
    mockCopyToClipboard.mockResolvedValue(true);

    render(<ShareSection />);

    const copyButton = screen.getByRole("button", { name: /URLをコピー/ });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith("https://example.com/event/123");
    });
  });

  it("should show alert when copy fails", async () => {
    mockCopyToClipboard.mockResolvedValue(false);

    render(<ShareSection />);

    const copyButton = screen.getByRole("button", { name: /URLをコピー/ });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("コピーに失敗しました。URL: https://example.com/event/123");
    });
  });

  it("should have proper container styling", () => {
    const { container } = render(<ShareSection />);

    const shareContainer = container.firstChild as HTMLElement;
    expect(shareContainer).toHaveClass("bg-white/80", "backdrop-blur-sm", "rounded-xl", "shadow-lg", "p-6", "mt-6");
  });

  it("should have proper button styling", () => {
    render(<ShareSection />);

    const copyButton = screen.getByRole("button", { name: /URLをコピー/ });
    expect(copyButton).toHaveClass(
      "bg-gray-800",
      "hover:bg-gray-900",
      "text-white",
      "px-4",
      "py-2",
      "rounded-lg",
      "text-sm",
      "transition-colors",
      "duration-200",
      "flex",
      "items-center",
      "gap-2",
    );
  });

  it("should render copy icon with proper title", () => {
    render(<ShareSection />);

    const copyIcon = screen.getByTitle("URLをコピー");
    expect(copyIcon).toBeInTheDocument();
  });

  it("should have proper flex layout", () => {
    render(<ShareSection />);

    const flexContainer = screen.getByText("このURLを共有してメンバーを招待").closest("div");
    expect(flexContainer).toHaveClass("flex", "items-center", "justify-between");
  });
});
