import { describe, it, expect } from "vitest";
import {
  validateEventId,
  validateUserId,
  validateEventTitle,
  validateNgDates,
  validateParticipantName,
  isValidUUID,
  isValidDateFormat,
} from "../../app/utils/validation";

describe("validation utilities", () => {
  describe("isValidUUID", () => {
    it("should validate correct UUID v4", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(isValidUUID(validUuid)).toBe(true);
    });

    it("should return false for invalid UUID format", () => {
      expect(isValidUUID("invalid-uuid")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidUUID("")).toBe(false);
    });

    it("should return false for non-string input", () => {
      expect(isValidUUID(123 as unknown as string)).toBe(false);
    });
  });

  describe("validateEventId", () => {
    it("should validate correct alphanumeric ID", () => {
      expect(() => validateEventId("abc123")).not.toThrow();
    });

    it("should throw error for invalid characters", () => {
      expect(() => validateEventId("invalid-id!")).toThrow("イベントIDが無効です");
    });

    it("should throw error for empty string", () => {
      expect(() => validateEventId("")).toThrow("イベントIDが無効です");
    });

    it("should throw error for non-string input", () => {
      expect(() => validateEventId(123 as unknown as string)).toThrow("イベントIDが無効です");
    });

    it("should throw error for too long ID", () => {
      const longId = "a".repeat(21);
      expect(() => validateEventId(longId)).toThrow("イベントIDが無効です");
    });
  });

  describe("validateUserId", () => {
    it("should validate correct UUID v4", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(() => validateUserId(validUuid)).not.toThrow();
    });

    it("should throw error for invalid UUID format", () => {
      expect(() => validateUserId("invalid-uuid")).toThrow("ユーザーIDが無効です");
    });

    it("should throw error for non-string input", () => {
      expect(() => validateUserId(123 as unknown as string)).toThrow("ユーザーIDが無効です");
    });
  });

  describe("isValidDateFormat", () => {
    it("should validate correct date format", () => {
      expect(isValidDateFormat("2024-01-01")).toBe(true);
      expect(isValidDateFormat("2024-12-31")).toBe(true);
    });

    it("should return false for invalid date format", () => {
      expect(isValidDateFormat("invalid-date")).toBe(false);
      expect(isValidDateFormat("2024-13-01")).toBe(false); // Invalid month
      expect(isValidDateFormat("2024-01-32")).toBe(false); // Invalid day
    });

    it("should return false for non-string input", () => {
      expect(isValidDateFormat(123 as unknown as string)).toBe(false);
    });
  });

  describe("validateEventTitle", () => {
    it("should return undefined for undefined input", () => {
      expect(validateEventTitle(undefined)).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      expect(validateEventTitle("")).toBeUndefined();
    });

    it("should return undefined for whitespace-only string", () => {
      expect(validateEventTitle("   ")).toBeUndefined();
    });

    it("should return trimmed string for valid input", () => {
      expect(validateEventTitle("  Valid Title  ")).toBe("Valid Title");
    });

    it("should throw error for non-string input", () => {
      expect(() => validateEventTitle(123 as unknown as string)).toThrow("タイトルは文字列である必要があります");
    });

    it("should throw error for title exceeding max length", () => {
      const longTitle = "a".repeat(51); // MAX_TITLE_LENGTH is 50
      expect(() => validateEventTitle(longTitle)).toThrow("タイトルは50文字以内で入力してください");
    });

    it("should accept title at max length", () => {
      const maxLengthTitle = "a".repeat(50);
      expect(validateEventTitle(maxLengthTitle)).toBe(maxLengthTitle);
    });
  });

  describe("validateNgDates", () => {
    it("should validate array of valid date strings", () => {
      const validDates = ["2024-01-01", "2024-12-31"];
      expect(() => validateNgDates(validDates)).not.toThrow();
    });

    it("should throw error for non-array input", () => {
      expect(() => validateNgDates("not-array" as unknown as string[])).toThrow("日付リストが無効です");
    });

    it("should throw error for invalid date format", () => {
      const invalidDates = ["2024-01-01", "invalid-date"];
      expect(() => validateNgDates(invalidDates)).toThrow("無効な日付形式が含まれています");
    });

    it("should accept empty array", () => {
      expect(() => validateNgDates([])).not.toThrow();
    });

    it("should throw error for malformed date", () => {
      const invalidDates = ["2024-13-01"]; // Invalid month
      expect(() => validateNgDates(invalidDates)).toThrow("無効な日付形式が含まれています");
    });

    it("should throw error for duplicate dates", () => {
      const duplicateDates = ["2024-01-01", "2024-01-02", "2024-01-01"];
      expect(() => validateNgDates(duplicateDates)).toThrow("重複した日付が含まれています");
    });

    it("should throw error for too many dates", () => {
      const tooManyDates = Array.from({ length: 366 }, (_, i) => `2024-01-${String((i % 31) + 1).padStart(2, "0")}`);
      expect(() => validateNgDates(tooManyDates)).toThrow("選択できる日付は365個までです");
    });
  });

  describe("validateParticipantName", () => {
    it("should return undefined for empty string", () => {
      expect(validateParticipantName("")).toBe(undefined);
    });

    it("should return undefined for undefined", () => {
      expect(validateParticipantName(undefined)).toBe(undefined);
    });

    it("should return trimmed string for valid name", () => {
      expect(validateParticipantName("田中太郎")).toBe("田中太郎");
    });

    it("should trim whitespace and return the name", () => {
      expect(validateParticipantName("  田中太郎  ")).toBe("田中太郎");
    });

    it("should return undefined for whitespace only", () => {
      expect(validateParticipantName("   ")).toBe(undefined);
    });

    it("should throw error for non-string input", () => {
      expect(() => validateParticipantName(123 as unknown as string)).toThrow("名前は文字列である必要があります");
    });

    it("should throw error for names longer than 20 characters", () => {
      const longName = "あ".repeat(21);
      expect(() => validateParticipantName(longName)).toThrow("名前は20文字以内で入力してください");
    });

    it("should accept names exactly 20 characters", () => {
      const exactlyTwentyChars = "あ".repeat(20);
      expect(validateParticipantName(exactlyTwentyChars)).toBe(exactlyTwentyChars);
    });

    it("should handle mixed Japanese and English characters", () => {
      expect(validateParticipantName("田中Taro")).toBe("田中Taro");
    });
  });
});
