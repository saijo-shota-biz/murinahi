import type { Event } from "@/app/model/Event";

interface EventSummaryProps {
  event: Event;
}

export function EventSummary({ event }: EventSummaryProps) {
  const participantCount = Object.keys(event.participants).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">集計</h2>
      <div className="text-sm text-gray-600">
        <p>
          現在 <span className="font-bold text-gray-800">{participantCount}名</span> が参加中
        </p>
        <p className="mt-2 text-xs text-gray-500">カレンダーの数字は、その日にNGな人数を表示しています</p>
      </div>
    </div>
  );
}
