import { Redis } from "@upstash/redis";
import type { Event } from "@/types/Event";
import { validateEventTitle } from "@/utils/validation";

const DAYS = 24 * 60 * 60;
const EVENT_TTL_DAYS = 30;

export async function createEvent(title?: string): Promise<string> {
  try {
    // タイトルのバリデーション
    const validatedTitle = validateEventTitle(title);

    const eventId = Math.random().toString(36).substring(2, 8);

    const event: Event = {
      id: eventId,
      title: validatedTitle,
      participants: {},
      createdAt: new Date().toISOString(),
    };

    const redis = Redis.fromEnv();
    await redis.setex(`event:${eventId}`, EVENT_TTL_DAYS * DAYS, event);

    return eventId;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`イベント作成エラー: ${error.message}`);
    }
    throw new Error("イベントの作成に失敗しました");
  }
}

export async function getEvent(eventId: string): Promise<Event | null> {
  try {
    const redis = Redis.fromEnv();
    return await redis.get<Event>(`event:${eventId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`イベント取得エラー: ${error.message}`);
    }
    throw new Error("イベントの取得に失敗しました");
  }
}
