"use server";

import { Redis } from "@upstash/redis";
import type { Event } from "./model/Event";

const DAYS = 24 * 60 * 60;
const redis = Redis.fromEnv();

export async function createEvent() {
  const eventId = Math.random().toString(36).substring(2, 8);

  const event = {
    id: eventId,
    participants: {},
    createdAt: new Date().toISOString(),
  };

  await redis.setex(`event:${eventId}`, 30 * DAYS, event);

  return eventId;
}

export async function updateParticipant(eventId: string, userName: string, ngDates: string[]) {
  "use server";

  const redis = Redis.fromEnv();

  // 楽観的ロックのためのリトライロジック
  for (let i = 0; i < 3; i++) {
    try {
      const event = await redis.get<Event>(`event:${eventId}`);
      if (!event) throw new Error("Event not found");

      // 参加者データを更新
      event.participants[userName] = { ng_dates: ngDates };

      // 保存（TTLをリセット）
      await redis.setex(`event:${eventId}`, 30 * 24 * 60 * 60, JSON.stringify(event));

      return { success: true };
    } catch (error) {
      if (i === 2) throw error;
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}
