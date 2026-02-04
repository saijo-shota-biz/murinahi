import { Redis } from "@upstash/redis";
import type { Event } from "@/types/Event";
import { validateEventId, validateUserId, validateNgDates, validateParticipantName } from "@/utils/validation";

const DAYS = 24 * 60 * 60;
const EVENT_TTL_DAYS = 30;

interface UpdateParticipantResult {
  success: boolean;
}

export async function updateParticipant(
  eventId: string,
  userId: string,
  ngDates: string[],
  name?: string,
  inputCompleted?: boolean,
): Promise<UpdateParticipantResult> {
  try {
    // バリデーション
    validateEventId(eventId);
    validateUserId(userId);
    validateNgDates(ngDates);
    const validatedName = validateParticipantName(name);

    const redis = Redis.fromEnv();

    // 楽観的ロックのためのリトライロジック
    for (let i = 0; i < 3; i++) {
      try {
        const event = await redis.get<Event>(`event:${eventId}`);
        if (!event) throw new Error("イベントが見つかりません");

        // 参加者データを更新
        event.participants[userId] = {
          ng_dates: ngDates,
          name: validatedName,
          inputCompleted: inputCompleted ?? false,
        };

        // 保存（TTLをリセット）
        await redis.setex(`event:${eventId}`, EVENT_TTL_DAYS * DAYS, event);

        return { success: true };
      } catch (error) {
        if (i === 2) throw error;
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    throw new Error("最大リトライ回数に達しました");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`データ更新エラー: ${error.message}`);
    }
    throw new Error("データの更新に失敗しました");
  }
}
