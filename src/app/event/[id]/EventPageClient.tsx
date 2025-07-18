"use client";

import { useEffect, useState } from "react";
import { updateParticipant } from "@/app/actions";
import type { Event } from "@/app/model/Event";

interface EventPageClientProps {
  event: Event;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const [userName, setUserName] = useState("");
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // ローカルストレージから名前を取得
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
      // 既存の参加者なら選択済み日付を復元
      if (event.participants[savedName]) {
        setSelectedDates(new Set(event.participants[savedName].ng_dates));
      }
    }
  }, [event.participants]);

  // 名前が変更されたら選択をリセット
  useEffect(() => {
    if (userName && event.participants[userName]) {
      setSelectedDates(new Set(event.participants[userName].ng_dates));
    } else {
      setSelectedDates(new Set());
    }
  }, [userName, event.participants]);

  const handleNameChange = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const handleDateClick = (date: string) => {
    if (!userName) {
      alert("先に名前を入力してください");
      return;
    }

    const newSelectedDates = new Set(selectedDates);
    if (newSelectedDates.has(date)) {
      newSelectedDates.delete(date);
    } else {
      newSelectedDates.add(date);
    }
    setSelectedDates(newSelectedDates);

    // 自動保存
    saveData(Array.from(newSelectedDates));
  };

  const saveData = async (dates: string[]) => {
    if (!userName) return;

    setIsSaving(true);
    try {
      await updateParticipant(event.id, userName, dates);
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
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  const getNGCountForDate = (dateStr: string) => {
    return Object.values(event.participants).filter((p) => p.ng_dates.includes(dateStr)).length;
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
              <title>TODO</title>
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
              <title>TODO</title>
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                />
              );
            }
            const dateStr = formatDate(day);
            const isSelected = selectedDates.has(dateStr);
            const ngCount = getNGCountForDate(dateStr);
            const isToday = formatDate(new Date()) === dateStr;

            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                disabled={!userName}
                className={`
                  relative aspect-square rounded-lg font-medium text-sm
                  transition-all duration-200 transform hover:scale-105
                  ${!userName ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  ${isToday ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                  ${
                    isSelected
                      ? "bg-red-500 text-white shadow-md"
                      : ngCount > 0
                        ? `bg-red-${Math.min(ngCount * 100, 400)} text-red-900`
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
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>他の人のNG日</span>
            </div>
          </div>
          {isSaving && (
            <div className="flex items-center gap-1 text-gray-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <title>TODO</title>
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
                <title>TODO</title>
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

        {/* Name Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label htmlFor="yourname" className="block text-sm font-medium text-gray-700 mb-2">
            あなたのお名前
          </label>
          <input
            id="yourname"
            type="text"
            value={userName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="名前を入力してください"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
          {!userName && <p className="mt-2 text-xs text-red-500">※名前を入力すると日付を選択できます</p>}
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

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">参加者のNG日</h2>

          {Object.keys(event.participants).length === 0 ? (
            <p className="text-gray-500 text-center py-8">まだ誰も登録していません</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(event.participants).map(([name, data]) => (
                <div key={name} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      {name}
                      {name === userName && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">あなた</span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">{data.ng_dates.length}日</span>
                  </div>
                  <div className="mt-1">
                    {data.ng_dates.length === 0 ? (
                      <span className="text-sm text-gray-500">なし</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.ng_dates.sort().map((date) => (
                          <span key={date} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {formatDisplayDate(date)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* URL Share */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">このURLを共有してメンバーを招待</p>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                alert("URLをコピーしました！");
              }}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>TODO</title>
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
      </div>
    </div>
  );
}
