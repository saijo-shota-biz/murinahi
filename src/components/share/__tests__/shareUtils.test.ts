import { describe, it, expect } from "vitest";
import { getShareText } from "../shareUtils";

describe("shareUtils", () => {
  describe("getShareText", () => {
    it("should generate share text with default URL", () => {
      const result = getShareText("https://murinahi.vercel.app");

      expect(result).toContain("「全員OKな日がない」を解決。");
      expect(result).toContain("参加できない日だけ選ぶ、逆転の日程調整。");
      expect(result).toContain("https://murinahi.vercel.app");
      expect(result).toContain("#ムリな日 #日程調整 #調整さんへ挑戦");
    });

    it("should generate share text with custom URL", () => {
      const customUrl = "https://example.com/event/123";
      const result = getShareText(customUrl);

      expect(result).toContain(customUrl);
      expect(result).toContain("「全員OKな日がない」を解決。");
    });

    it("should include all required elements", () => {
      const result = getShareText("https://test.com");

      expect(result).toMatch(/「全員OKな日がない」を解決。/);
      expect(result).toMatch(/参加できない日だけ選ぶ、逆転の日程調整。/);
      expect(result).toMatch(/URLシェアするだけ。登録不要。/);
      expect(result).toMatch(/https:\/\/test\.com/);
      expect(result).toMatch(/#ムリな日 #日程調整 #調整さんへ挑戦/);
    });
  });
});
