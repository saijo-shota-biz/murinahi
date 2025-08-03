import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareModal } from "../ShareModal";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
  share: vi.fn(() => Promise.resolve()),
});

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe("ShareModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<ShareModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText("ムリな日カレンダーをシェア")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("ムリな日カレンダーをシェア")).toBeInTheDocument();
  });

  it("should display share options", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("🐦 Twitter/X でシェア")).toBeInTheDocument();
    expect(screen.getByText("💬 LINE でシェア")).toBeInTheDocument();
    expect(screen.getByText("🔗 URLをコピー")).toBeInTheDocument();
  });

  it("should show system share option when navigator.share is available", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("📱 システムのシェア機能")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ShareModal isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: /閉じる/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<ShareModal isOpen={true} onClose={onClose} />);

    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should copy URL to clipboard when copy button is clicked", async () => {
    const testUrl = "https://example.com";
    render(<ShareModal isOpen={true} onClose={vi.fn()} url={testUrl} />);

    const copyButton = screen.getByText("🔗 URLをコピー");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testUrl);
      expect(screen.getByText("✅ コピーしました！")).toBeInTheDocument();
    });
  });

  it("should open Twitter when Twitter share button is clicked", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    const twitterButton = screen.getByText("🐦 Twitter/X でシェア");
    fireEvent.click(twitterButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should open LINE when LINE share button is clicked", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    const lineButton = screen.getByText("💬 LINE でシェア");
    fireEvent.click(lineButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://social-plugins.line.me/lineit/share"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("should use custom url and title props", () => {
    const customUrl = "https://example.com/custom";
    const customTitle = "Custom Title";

    render(<ShareModal isOpen={true} onClose={vi.fn()} url={customUrl} title={customTitle} />);

    expect(
      screen.getByText((content, _element) => {
        return content.includes(customUrl);
      }),
    ).toBeInTheDocument();
  });

  it("should display share content preview", () => {
    render(<ShareModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("シェア内容プレビュー:")).toBeInTheDocument();
    expect(screen.getByText(/ムリな日カレンダー使ってみた！/)).toBeInTheDocument();
  });
});
