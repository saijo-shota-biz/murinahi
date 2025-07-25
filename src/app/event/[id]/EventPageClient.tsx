"use client";

import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import { updateParticipant } from "@/app/actions";
import type { Event } from "@/app/model/Event";

interface EventPageClientProps {
  event: Event;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [clipboardSupported, setClipboardSupported] = useState<boolean | null>(null);


  // 自動的にユーザーIDを生成・取得
  useEffect(() => {
    try {
      let id = localStorage.getItem("userId");
      console.log("LocalStorage userId:", id); // デバッグ用
      if (!id) {
        id = uuidv4();
        console.log("新しいUUID生成:", id); // デバッグ用
        try {
          localStorage.setItem("userId", id);
        } catch (error) {
          console.error("localStorage保存エラー:", error);
          // localStorageが使えない場合でもアプリケーションは動作継続
        }
      }
      setUserId(id);
      console.log("設定されたuserId:", id); // デバッグ用
      console.log("event.participants:", event.participants); // デバッグ用
      
      // 既存の参加者なら選択済み日付を復元
      if (event.participants[id]) {
        console.log("既存参加者のNG日を復元:", event.participants[id].ng_dates); // デバッグ用
        setSelectedDates(new Set(event.participants[id].ng_dates));
      }
    } catch (error) {
      console.error("ユーザーID初期化エラー:", error);
      // エラーが発生してもランダムIDを生成して継続
      setUserId(uuidv4());
    }
  }, [event.participants]);

  // Clipboard APIのサポート状況をチェック
  useEffect(() => {
    setClipboardSupported(
      typeof navigator !== 'undefined' && 
      !!navigator.clipboard && 
      window.isSecureContext
    );
  }, []);


  const handleDateClick = (date: string) => {
    if (!userId) return;

    const newSelectedDates = new Set(selectedDates);
    if (newSelectedDates.has(date)) {
      newSelectedDates.delete(date);
    } else {
      newSelectedDates.add(date);
    }
    setSelectedDates(newSelectedDates);

    // 自動保存 - Promiseを適切にハンドリング
    saveData(Array.from(newSelectedDates)).catch((error) => {
      console.error("自動保存エラー:", error);
    });
  };

  const saveData = async (dates: string[]) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      await updateParticipant(event.id, userId, dates);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error("保存に失敗しました:", error);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 月初の曜日まで空白を追加
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // 日付を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // NG日カウントをメモ化して最適化
  const ngCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(event.participants).forEach(p => {
      p.ng_dates.forEach(date => {
        counts[date] = (counts[date] || 0) + 1;
      });
    });
    return counts;
  }, [event.participants]);

  const getNGCountForDate = (dateStr: string) => {
    return ngCountsByDate[dateStr] || 0;
  };


  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>前の月へ</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>次の月へ</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: Empty divs need unique keys
                    index
                  }`}
                />
              );
            }
            const dateStr = formatDate(day);
            const isSelected = selectedDates.has(dateStr);
            const ngCount = getNGCountForDate(dateStr);
            const isToday = formatDate(new Date()) === dateStr;
            const isPastDate = day < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                disabled={!userId || isPastDate}
                className={`
                  relative aspect-square rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${!userId || isPastDate ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"}
                  ${isToday ? "ring-2 ring-blue-400" : ""}
                  ${
                    isSelected
                      ? "bg-red-500 text-white shadow-md"
                      : ngCount > 0
                        ? "bg-red-300 text-red-900 hover:bg-red-400"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <span>{day.getDate()}</span>
                {ngCount > 0 && !isSelected && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {ngCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>あなたのNG日</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-300 rounded"></div>
              <span>他の人のNG日</span>
            </div>
          </div>
          {isSaving && (
            <div className="flex items-center gap-1 text-gray-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <title>読み込み中</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>保存中...</span>
            </div>
          )}
          {showSaveSuccess && (
            <div className="flex items-center gap-1 text-green-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>保存完了</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>保存しました</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const monthTabs = [
    { label: `${new Date().getMonth() + 1}月`, date: new Date() },
    { label: `${new Date().getMonth() + 2}月`, date: new Date(new Date().getFullYear(), new Date().getMonth() + 1) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">ムリな日</span>
            を選択
          </h1>
          <p className="text-gray-600">参加できない日をタップしてください</p>
        </div>


        {/* Month Tabs */}
        <div className="flex gap-2 mb-4">
          {monthTabs.map((tab) => (
            <button
              type="button"
              key={tab.label}
              onClick={() => setCurrentMonth(tab.date)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  currentMonth.getMonth() === tab.date.getMonth()
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        {renderCalendar()}

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">集計</h2>
          <div className="text-sm text-gray-600">
            <p>現在 <span className="font-bold text-gray-800">{Object.keys(event.participants).length}名</span> が参加中</p>
            <p className="mt-2 text-xs text-gray-500">カレンダーの数字は、その日にNGな人数を表示しています</p>
          </div>
        </div>

        {/* URL Share - Clipboard APIがサポートされている場合のみ表示 */}
        {clipboardSupported && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">このURLを共有してメンバーを招待</p>
              <button
                type="button"
                onClick={async () => {
                  const url = window.location.href;
                  try {
                    await navigator.clipboard.writeText(url);
                    alert("URLをコピーしました！");
                  } catch (error) {
                    console.error("クリップボードコピーエラー:", error);
                    alert(`コピーに失敗しました。URL: ${url}`);
                  }
                }}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>URLをコピー</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                URLをコピー
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
