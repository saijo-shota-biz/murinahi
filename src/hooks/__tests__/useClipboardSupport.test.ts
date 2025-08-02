import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClipboardSupport } from "../useClipboardSupport";

describe("useClipboardSupport", () => {
  beforeEach(() => {
    // Reset navigator
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when clipboard API is supported and context is secure", () => {
    // Since our setup already mocks these as true, just test the hook
    const { result } = renderHook(() => useClipboardSupport());
    expect(result.current.clipboardSupported).toBe(true);
  });

  it("should return clipboard support status", () => {
    const { result } = renderHook(() => useClipboardSupport());
    expect(typeof result.current.clipboardSupported).toBe("boolean");
  });
});
