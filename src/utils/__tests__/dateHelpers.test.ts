import { describe, it, expect } from "vitest";
import { getDaysInMonth, formatDate } from "../dateHelpers";

describe("dateHelpers", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date(2024, 0, 1); // January 1, 2024
      expect(formatDate(date)).toBe("2024-01-01");
    });

    it("should pad single digit months and days", () => {
      const date = new Date(2024, 4, 5); // May 5, 2024
      expect(formatDate(date)).toBe("2024-05-05");
    });

    it("should handle December correctly", () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      expect(formatDate(date)).toBe("2024-12-31");
    });
  });

  describe("getDaysInMonth", () => {
    it("should return correct days for January 2024", () => {
      const date = new Date(2024, 0, 1); // January 2024
      const days = getDaysInMonth(date);

      // January 1, 2024 was a Monday, so should have 1 empty slot at start
      expect(days.length).toBe(32); // 1 empty + 31 days
      expect(days[0]).toBeNull();
      expect(days[1]).toEqual(new Date(2024, 0, 1));
      expect(days[31]).toEqual(new Date(2024, 0, 31));
    });

    it("should return correct days for February 2024 (leap year)", () => {
      const date = new Date(2024, 1, 1); // February 2024
      const days = getDaysInMonth(date);

      // February 1, 2024 was a Thursday, so should have 4 empty slots at start
      expect(days.slice(0, 4).every((day) => day === null)).toBe(true);
      expect(days[4]).toEqual(new Date(2024, 1, 1));
      expect(days[32]).toEqual(new Date(2024, 1, 29)); // 29 days in leap year
      expect(days.length).toBe(33); // 4 empty + 29 days
    });

    it("should return correct days for February 2023 (non-leap year)", () => {
      const date = new Date(2023, 1, 1); // February 2023
      const days = getDaysInMonth(date);

      // February 1, 2023 was a Wednesday, so should have 3 empty slots at start
      expect(days.slice(0, 3).every((day) => day === null)).toBe(true);
      expect(days[3]).toEqual(new Date(2023, 1, 1));
      expect(days[30]).toEqual(new Date(2023, 1, 28)); // 28 days in non-leap year
      expect(days.length).toBe(31); // 3 empty + 28 days
    });

    it("should handle months starting on Sunday", () => {
      const date = new Date(2024, 8, 1); // September 2024 (starts on Sunday)
      const days = getDaysInMonth(date);

      // No empty slots at start since it starts on Sunday (day 0)
      expect(days[0]).toEqual(new Date(2024, 8, 1));
      expect(days[29]).toEqual(new Date(2024, 8, 30));
      expect(days.length).toBe(30); // 0 empty + 30 days
    });
  });
});
