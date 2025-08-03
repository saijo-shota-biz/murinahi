import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "../useClipboard";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock navigator.clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should initialize with justCopied as false", () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.justCopied).toBe(false);
  });

  it("should copy text successfully and set justCopied to true", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.writeText = mockWriteText;

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard("test text");
      expect(success).toBe(true);
    });

    expect(mockWriteText).toHaveBeenCalledWith("test text");
    expect(result.current.justCopied).toBe(true);
  });

  it("should reset justCopied to false after 2 seconds", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.writeText = mockWriteText;

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard("test text");
    });

    expect(result.current.justCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.justCopied).toBe(false);
  });

  it("should return false and log error when clipboard write fails", async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error("Clipboard error"));
    navigator.clipboard.writeText = mockWriteText;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard("test text");
      expect(success).toBe(false);
    });

    expect(mockWriteText).toHaveBeenCalledWith("test text");
    expect(result.current.justCopied).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("URLのコピーに失敗しました:", expect.any(Error));

    consoleSpy.mockRestore();
  });

  it("should handle multiple copy operations correctly", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.writeText = mockWriteText;

    const { result } = renderHook(() => useClipboard());

    // First copy
    await act(async () => {
      await result.current.copyToClipboard("first text");
    });
    expect(result.current.justCopied).toBe(true);

    // Second copy before first timeout
    await act(async () => {
      await result.current.copyToClipboard("second text");
    });
    expect(result.current.justCopied).toBe(true);

    // Advance time to trigger timeout
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.justCopied).toBe(false);
    expect(mockWriteText).toHaveBeenCalledTimes(2);
    expect(mockWriteText).toHaveBeenNthCalledWith(1, "first text");
    expect(mockWriteText).toHaveBeenNthCalledWith(2, "second text");
  });
});
