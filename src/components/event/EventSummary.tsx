import { useMemo } from "react";
import type { Event } from "@/types/Event";

interface EventSummaryProps {
  event: Event;
}

export function EventSummary({ event }: EventSummaryProps) {
  const participantCount = Object.keys(event.participants).length;

  // 参加者リストを生成（名前順ソート、匿名参加者は「ななしさん」として採番）
  const participantsList = useMemo(() => {
    const participants = Object.entries(event.participants);
    const namedParticipants: Array<{ name: string; inputCompleted: boolean }> = [];
    const anonymousParticipants: Array<{ id: string; order: number; inputCompleted: boolean }> = [];

    // 名前ありと匿名を分類
    participants.forEach(([id, participant], index) => {
      if (participant.name) {
        namedParticipants.push({ name: participant.name, inputCompleted: participant.inputCompleted ?? false });
      } else {
        anonymousParticipants.push({ id, order: index, inputCompleted: participant.inputCompleted ?? false });
      }
    });

    // 名前ありを名前順でソート
    namedParticipants.sort((a, b) => a.name.localeCompare(b.name, "ja"));

    // 結果を結合
    const result = [
      ...namedParticipants.map((p) => ({
        displayName: p.name.length > 20 ? `${p.name.slice(0, 17)}...` : p.name,
        inputCompleted: p.inputCompleted,
      })),
      ...anonymousParticipants.map((p, index) => ({
        displayName: anonymousParticipants.length === 1 ? "ななしさん" : `ななしさん${index + 1}`,
        inputCompleted: p.inputCompleted,
      })),
    ];

    return result;
  }, [event.participants]);

  const inputInProgressCount = useMemo(() => {
    return Object.values(event.participants).filter((p) => !p.inputCompleted).length;
  }, [event.participants]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">集計</h2>
      <div className="text-sm text-gray-600">
        <p>
          現在 <span className="font-bold text-gray-800">{participantCount}名</span> が参加中
          {inputInProgressCount > 0 && <span className="text-gray-500">（{inputInProgressCount}名が入力中）</span>}
        </p>
        <p className="mt-2 text-xs text-gray-500">カレンダーの数字は、その日にNGな人数を表示しています</p>

        {participantsList.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">参加者一覧</h3>
            <ul className="space-y-1">
              {participantsList.map((participant) => (
                <li
                  key={participant.displayName}
                  className="py-1 px-2 hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <span className="text-gray-700">{participant.displayName}</span>
                  {participant.inputCompleted ? (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">入力できた</span>
                  ) : (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">入力中</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
