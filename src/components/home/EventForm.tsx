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

function getEndOfMonth(year: number, month: number): string {
  const lastDay = new Date(year, month + 1, 0);
  return formatDate(lastDay);
}

function getTodayString(): string {
  return formatDate(new Date());
}

type ShortcutKey = "1w" | "2w" | "30d" | "60d" | "m0" | "m1" | "m2";

function getShortcuts(): { key: ShortcutKey; label: string }[] {
  const today = new Date();
  const currentMonth = today.getMonth();

  const getMonthLabel = (offset: number): string => {
    const month = (currentMonth + offset) % 12;
    return `${month + 1}月`;
  };

  return [
    { key: "1w", label: "1週間" },
    { key: "2w", label: "2週間" },
    { key: "30d", label: "30日" },
    { key: "60d", label: "60日" },
    { key: "m0", label: getMonthLabel(0) },
    { key: "m1", label: getMonthLabel(1) },
    { key: "m2", label: getMonthLabel(2) },
  ];
}

function getStartOfMonth(year: number, month: number): string {
  const firstDay = new Date(year, month, 1);
  return formatDate(firstDay);
}

function getShortcutDates(key: ShortcutKey): { start: string; end: string } {
  const today = new Date();
  const todayStr = getTodayString();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  switch (key) {
    case "1w":
      return { start: todayStr, end: addDaysToDate(today, 7) };
    case "2w":
      return { start: todayStr, end: addDaysToDate(today, 14) };
    case "30d":
      return { start: todayStr, end: addDaysToDate(today, 30) };
    case "60d":
      return { start: todayStr, end: addDaysToDate(today, 60) };
    case "m0":
      return { start: todayStr, end: getEndOfMonth(currentYear, currentMonth) };
    case "m1": {
      const nextMonth = currentMonth + 1;
      const year = nextMonth > 11 ? currentYear + 1 : currentYear;
      const month = nextMonth % 12;
      return { start: getStartOfMonth(year, month), end: getEndOfMonth(year, month) };
    }
    case "m2": {
      const targetMonth = currentMonth + 2;
      const year = targetMonth > 11 ? currentYear + 1 : currentYear;
      const month = targetMonth % 12;
      return { start: getStartOfMonth(year, month), end: getEndOfMonth(year, month) };
    }
  }
}

function getActiveShortcut(startDate: string, endDate: string): ShortcutKey | null {
  const shortcuts: ShortcutKey[] = ["1w", "2w", "30d", "60d", "m0", "m1", "m2"];
  for (const key of shortcuts) {
    const dates = getShortcutDates(key);
    if (startDate === dates.start && endDate === dates.end) {
      return key;
    }
  }
  return null;
}

export function EventForm({ onEventCreated }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copyToClipboard } = useClipboard();

  const shortcuts = getShortcuts();

  const handleShortcutClick = (key: ShortcutKey) => {
    setError(null);
    const dates = getShortcutDates(key);

    if (startDate === dates.start && endDate === dates.end) {
      setStartDate("");
      setEndDate("");
      return;
    }

    setStartDate(dates.start);
    setEndDate(dates.end);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);
    try {
      const eventId = await createEvent(eventTitle, startDate || undefined, endDate || undefined);
      const url = `${window.location.origin}/event/${eventId}`;
      onEventCreated(url);
      await copyToClipboard(url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const activeShortcut = startDate && endDate ? getActiveShortcut(startDate, endDate) : null;

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
          <span className="text-sm text-gray-600">回答期間</span>
          <div className="flex gap-1.5 flex-wrap">
            {shortcuts.map(({ key, label }) => (
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
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      <Button
        type="submit"
        loading={isCreating}
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
