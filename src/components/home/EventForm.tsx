"use client";

import { useState } from "react";
import { createEvent } from "@/app/actions";
import { Button, Input } from "@/components/ui";
import { useClipboard } from "@/hooks";
import { formatDate } from "@/utils/dateHelpers";

interface EventFormProps {
  onEventCreated: (url: string) => void;
}

function addDaysToDate(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function addMonthsToDate(base: Date, months: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}

function getTodayString(): string {
  return formatDate(new Date());
}

function getMaxDateString(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return formatDate(d);
}

type ShortcutKey = "1w" | "2w" | "1m" | "2m";

const SHORTCUTS: { key: ShortcutKey; label: string }[] = [
  { key: "1w", label: "1週間" },
  { key: "2w", label: "2週間" },
  { key: "1m", label: "1ヶ月" },
  { key: "2m", label: "2ヶ月" },
];

function getShortcutEndDate(key: ShortcutKey): string {
  const today = new Date();
  switch (key) {
    case "1w":
      return addDaysToDate(today, 7);
    case "2w":
      return addDaysToDate(today, 14);
    case "1m":
      return addMonthsToDate(today, 1);
    case "2m":
      return addMonthsToDate(today, 2);
  }
}

function getActiveShortcut(startDate: string, endDate: string): ShortcutKey | null {
  const todayStr = getTodayString();
  if (startDate !== todayStr) return null;

  for (const shortcut of SHORTCUTS) {
    if (endDate === getShortcutEndDate(shortcut.key)) {
      return shortcut.key;
    }
  }
  return null;
}

export function EventForm({ onEventCreated }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const { copyToClipboard } = useClipboard();

  const genUrl = (eventId: string) => {
    return `${window.location.origin}/event/${eventId}`;
  };

  const handleShortcutClick = (key: ShortcutKey) => {
    setDateError(null);
    const todayStr = getTodayString();
    const end = getShortcutEndDate(key);

    // 同じショートカットをもう一度押したらクリア
    if (startDate === todayStr && endDate === end) {
      setStartDate("");
      setEndDate("");
      return;
    }

    setStartDate(todayStr);
    setEndDate(end);
  };

  const handleStartDateChange = (value: string) => {
    setDateError(null);
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setDateError(null);
    setEndDate(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);
    setIsCreating(true);
    try {
      const eventId = await createEvent(eventTitle, startDate || undefined, endDate || undefined);
      const url = genUrl(eventId);
      onEventCreated(url);
      await copyToClipboard(url);
    } catch (error) {
      if (error instanceof Error) {
        setDateError(error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const activeShortcut = startDate && endDate ? getActiveShortcut(startDate, endDate) : null;
  const hasPartialDateRange = (startDate && !endDate) || (!startDate && endDate);

  const dateInputClass =
    "w-0 min-w-0 flex-1 px-2 py-1.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        placeholder="イベント名（例：新年会、旅行計画）"
        maxLength={50}
        variant="large"
        className="w-full"
      />

      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="text-xs font-medium text-gray-400 tracking-wide">詳細設定</div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-600">回答期間</span>
            <div className="flex gap-1.5 flex-wrap">
              {SHORTCUTS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleShortcutClick(key)}
                  aria-pressed={activeShortcut === key}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    activeShortcut === key
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={getTodayString()}
              max={getMaxDateString()}
              aria-label="開始日"
              className={dateInputClass}
            />
            <span className="text-gray-400 text-sm shrink-0">〜</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate || getTodayString()}
              max={getMaxDateString()}
              aria-label="終了日"
              className={dateInputClass}
            />
          </div>
          {hasPartialDateRange && (
            <p className="text-xs text-amber-600">開始日と終了日の両方を入力してください</p>
          )}
          {dateError && <p className="text-xs text-red-500">{dateError}</p>}
        </div>
      </div>

      <Button
        type="submit"
        loading={isCreating}
        disabled={hasPartialDateRange}
        size="lg"
        className="group relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200 -z-10"></div>
        <span className="relative z-10">
          {isCreating ? (
            "作成中..."
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>イベント作成</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              イベントを作る
            </>
          )}
        </span>
      </Button>
    </form>
  );
}
