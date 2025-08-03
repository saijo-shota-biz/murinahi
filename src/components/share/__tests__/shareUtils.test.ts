import { describe, it, expect } from "vitest";
import { getShareText } from "../shareUtils";

describe("shareUtils", () => {
  describe("getShareText", () => {
    it("should generate share text with default URL", () => {
      const result = getShareText("https://murinahi.vercel.app");
      
      expect(result).toContain("ムリな日カレンダー使ってみた！");
      expect(result).toContain("日程調整がめっちゃ楽になる😊");
      expect(result).toContain("https://murinahi.vercel.app");
      expect(result).toContain("#ムリな日 #日程調整 #調整さんへ挑戦");
    });

    it("should generate share text with custom URL", () => {
      const customUrl = "https://example.com/event/123";
      const result = getShareText(customUrl);
      
      expect(result).toContain(customUrl);
      expect(result).toContain("ムリな日カレンダー使ってみた！");
    });

    it("should include all required elements", () => {
      const result = getShareText("https://test.com");
      
      expect(result).toMatch(/ムリな日カレンダー使ってみた！/);
      expect(result).toMatch(/日程調整がめっちゃ楽になる😊/);
      expect(result).toMatch(/調整さんより使いやすくて/);
      expect(result).toMatch(/誰でも簡単に参加できるのがいい✨/);
      expect(result).toMatch(/https:\/\/test\.com/);
      expect(result).toMatch(/#ムリな日 #日程調整 #調整さんへ挑戦/);
    });
  });
});