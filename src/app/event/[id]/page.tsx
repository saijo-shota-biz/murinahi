import { Redis } from "@upstash/redis";
import type { Event } from "@/app/model/Event";
import EventPageClient from "./EventPageClient";

const redis = Redis.fromEnv();

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  // データ取得
  const event = await redis.get<Event>(`event:${id}`);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>エラーアイコン</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-xl font-bold text-gray-800 mb-2">イベントが見つかりません</h1>
          <p className="text-gray-600">URLをご確認ください</p>
        </div>
      </div>
    );
  }

  return <EventPageClient event={event} />;
}
