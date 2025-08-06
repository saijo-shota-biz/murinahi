import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEvent, getEvent } from "../eventService";

// Redisのモック
const mockRedis = {
  setex: vi.fn(),
  get: vi.fn(),
};

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => mockRedis),
  },
}));

// バリデーション関数のモック
vi.mock("@/utils/validation", () => ({
  validateEventTitle: vi.fn((title) => title?.trim() || undefined),
}));

describe("eventService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should create an event with title", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      const eventId = await createEvent("テストイベント");

      expect(eventId).toMatch(/^[a-z0-9]{6}$/);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        `event:${eventId}`,
        2592000, // 30 days in seconds
        expect.objectContaining({
          id: eventId,
          title: "テストイベント",
          participants: {},
          createdAt: expect.any(String),
        }),
      );
    });

    it("should create an event without title", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      const eventId = await createEvent();

      expect(eventId).toMatch(/^[a-z0-9]{6}$/);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        `event:${eventId}`,
        2592000,
        expect.objectContaining({
          id: eventId,
          title: undefined,
          participants: {},
        }),
      );
    });

    it("should handle Redis errors", async () => {
      mockRedis.setex.mockRejectedValue(new Error("Redis connection failed"));

      await expect(createEvent("テスト")).rejects.toThrow("イベント作成エラー: Redis connection failed");
    });

    it("should handle validation errors", async () => {
      const { validateEventTitle } = await import("@/utils/validation");
      vi.mocked(validateEventTitle).mockImplementation(() => {
        throw new Error("タイトルが長すぎます");
      });

      await expect(createEvent("very long title")).rejects.toThrow("イベント作成エラー: タイトルが長すぎます");
    });
  });

  describe("getEvent", () => {
    it("should get an existing event", async () => {
      const mockEvent = {
        id: "abc123",
        title: "テストイベント",
        participants: {},
        createdAt: "2024-01-01T00:00:00Z",
      };
      mockRedis.get.mockResolvedValue(mockEvent);

      const result = await getEvent("abc123");

      expect(result).toEqual(mockEvent);
      expect(mockRedis.get).toHaveBeenCalledWith("event:abc123");
    });

    it("should return null for non-existent event", async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await getEvent("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle Redis errors", async () => {
      mockRedis.get.mockRejectedValue(new Error("Redis connection failed"));

      await expect(getEvent("abc123")).rejects.toThrow("イベント取得エラー: Redis connection failed");
    });
  });
});
