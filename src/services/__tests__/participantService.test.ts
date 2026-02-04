import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateParticipant } from "../participantService";
import type { Event } from "@/types/Event";

// Redisのモック
const mockRedis = {
  get: vi.fn(),
  setex: vi.fn(),
};

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => mockRedis),
  },
}));

// バリデーション関数のモック
vi.mock("@/utils/validation", () => ({
  validateEventId: vi.fn(),
  validateUserId: vi.fn(),
  validateNgDates: vi.fn(),
  validateParticipantName: vi.fn((name) => name?.trim() || undefined),
}));

describe("participantService", () => {
  const mockEvent: Event = {
    id: "abc123",
    title: "テストイベント",
    participants: {},
    createdAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateParticipant", () => {
    it("should update participant with name", async () => {
      mockRedis.get.mockResolvedValue({ ...mockEvent });
      mockRedis.setex.mockResolvedValue("OK");

      const result = await updateParticipant("abc123", "user123", ["2024-01-15", "2024-01-16"], "田中太郎");

      expect(result).toEqual({ success: true });
      expect(mockRedis.get).toHaveBeenCalledWith("event:abc123");
      expect(mockRedis.setex).toHaveBeenCalledWith(
        "event:abc123",
        2592000,
        expect.objectContaining({
          participants: {
            user123: {
              ng_dates: ["2024-01-15", "2024-01-16"],
              name: "田中太郎",
              inputCompleted: false,
            },
          },
        }),
      );
    });

    it("should update participant without name", async () => {
      mockRedis.get.mockResolvedValue({ ...mockEvent });
      mockRedis.setex.mockResolvedValue("OK");

      const result = await updateParticipant("abc123", "user123", ["2024-01-15"]);

      expect(result).toEqual({ success: true });
      expect(mockRedis.setex).toHaveBeenCalledWith(
        "event:abc123",
        2592000,
        expect.objectContaining({
          participants: {
            user123: {
              ng_dates: ["2024-01-15"],
              name: undefined,
              inputCompleted: false,
            },
          },
        }),
      );
    });

    it("should preserve existing participants", async () => {
      const existingEvent = {
        ...mockEvent,
        participants: {
          existingUser: {
            ng_dates: ["2024-01-10"],
            name: "既存ユーザー",
          },
        },
      };
      mockRedis.get.mockResolvedValue(existingEvent);
      mockRedis.setex.mockResolvedValue("OK");

      await updateParticipant("abc123", "newUser", ["2024-01-15"], "新規ユーザー");

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "event:abc123",
        2592000,
        expect.objectContaining({
          participants: {
            existingUser: {
              ng_dates: ["2024-01-10"],
              name: "既存ユーザー",
            },
            newUser: {
              ng_dates: ["2024-01-15"],
              name: "新規ユーザー",
              inputCompleted: false,
            },
          },
        }),
      );
    });

    it("should throw error when event not found", async () => {
      mockRedis.get.mockResolvedValue(null);

      await expect(updateParticipant("nonexistent", "user123", ["2024-01-15"])).rejects.toThrow(
        "データ更新エラー: イベントが見つかりません",
      );
    });

    it("should retry on Redis failure and succeed", async () => {
      mockRedis.get.mockRejectedValueOnce(new Error("Connection failed")).mockResolvedValue({ ...mockEvent });
      mockRedis.setex.mockResolvedValue("OK");

      const result = await updateParticipant("abc123", "user123", ["2024-01-15"]);

      expect(result).toEqual({ success: true });
      expect(mockRedis.get).toHaveBeenCalledTimes(2);
    });

    it("should fail after maximum retries", async () => {
      mockRedis.get.mockRejectedValue(new Error("Connection failed"));

      await expect(updateParticipant("abc123", "user123", ["2024-01-15"])).rejects.toThrow(
        "データ更新エラー: Connection failed",
      );

      expect(mockRedis.get).toHaveBeenCalledTimes(3);
    });

    it("should handle validation errors", async () => {
      const { validateEventId } = await import("@/utils/validation");
      vi.mocked(validateEventId).mockImplementation(() => {
        throw new Error("無効なイベントID");
      });

      await expect(updateParticipant("invalid", "user123", ["2024-01-15"])).rejects.toThrow(
        "データ更新エラー: 無効なイベントID",
      );
    });
  });
});
