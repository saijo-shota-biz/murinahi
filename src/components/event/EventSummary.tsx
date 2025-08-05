import { useMemo } from "react";
import type { Event } from "@/app/model/Event";

interface EventSummaryProps {
  event: Event;
}

export function EventSummary({ event }: EventSummaryProps) {
  const participantCount = Object.keys(event.participants).length;

  // 参加者リストを生成（名前順ソート、匿名参加者は「ななしさん」として採番）
  const participantsList = useMemo(() => {
    const participants = Object.entries(event.participants);
    const namedParticipants: Array<{ name: string; ngCount: number }> = [];
    const anonymousParticipants: Array<{ id: string; ngCount: number; order: number }> = [];

    // 名前ありと匿名を分類
    participants.forEach(([id, participant], index) => {
      const ngCount = participant.ng_dates.length;
      if (participant.name) {
        namedParticipants.push({ name: participant.name, ngCount });
      } else {
        anonymousParticipants.push({ id, ngCount, order: index });
      }
    });

    // 名前ありを名前順でソート
    namedParticipants.sort((a, b) => a.name.localeCompare(b.name, "ja"));

    // 結果を結合
    const result = [
      ...namedParticipants.map((p) => ({
        displayName: p.name.length > 20 ? `${p.name.slice(0, 17)}...` : p.name,
        ngCount: p.ngCount,
      })),
      ...anonymousParticipants.map((p, index) => ({
        displayName: anonymousParticipants.length === 1 ? "ななしさん" : `ななしさん${index + 1}`,
        ngCount: p.ngCount,
      })),
    ];

    return result;
  }, [event.participants]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">集計</h2>
      <div className="text-sm text-gray-600">
        <p>
          現在 <span className="font-bold text-gray-800">{participantCount}名</span> が参加中
        </p>
        <p className="mt-2 text-xs text-gray-500">カレンダーの数字は、その日にNGな人数を表示しています</p>

        {participantsList.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">参加者一覧</h3>
            <ul className="space-y-1">
              {participantsList.map((participant) => (
                <li
                  key={participant.displayName}
                  className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-gray-700">{participant.displayName}</span>
                  <span className="text-sm text-gray-500">{participant.ngCount}日NG</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
