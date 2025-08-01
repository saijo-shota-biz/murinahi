import { Redis } from "@upstash/redis";
import type { Event } from "@/app/model/Event";
import type { Metadata } from "next";
import EventPageClient from "./EventPageClient";

const redis = Redis.fromEnv();

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;

  // イベントデータを取得してタイトルを使用
  const event = await redis.get<Event>(`event:${id}`);
  const eventTitle = event?.title || `イベント ${id}`;

  return {
    title: `${eventTitle} の日程調整`,
    description: "参加できない日を選んで、みんなの都合の良い日を見つけよう。ムリな日カレンダーで簡単日程調整。",
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${eventTitle} | ムリな日カレンダー`,
      description: "参加できない日を選んで、みんなの都合の良い日を見つけよう。",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(eventTitle)}&subtitle=日程調整中`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
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
