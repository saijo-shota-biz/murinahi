import { CalendarDay } from "./CalendarDay";
import { getDaysInMonth, formatDate } from "@/utils/dateHelpers";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDates: Set<string>;
  onDateClick: (date: string) => void;
  getNGCountForDate: (date: string) => number;
  userId: string | null;
}

export function CalendarGrid({
  currentMonth,
  selectedDates,
  onDateClick,
  getNGCountForDate,
  userId,
}: CalendarGridProps) {
  const days = getDaysInMonth(currentMonth);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
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
          <CalendarDay
            key={dateStr}
            date={day}
            dateStr={dateStr}
            isSelected={isSelected}
            ngCount={ngCount}
            isToday={isToday}
            isPastDate={isPastDate}
            userId={userId}
            onDateClick={onDateClick}
          />
        );
      })}
    </div>
  );
}
