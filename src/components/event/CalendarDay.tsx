interface CalendarDayProps {
  date: Date;
  dateStr: string;
  isSelected: boolean;
  ngCount: number;
  isToday: boolean;
  isPastDate: boolean;
  userId: string | null;
  onDateClick: (date: string) => void;
  disabled?: boolean;
}

export function CalendarDay({
  date,
  dateStr,
  isSelected,
  ngCount,
  isToday,
  isPastDate,
  userId,
  onDateClick,
  disabled,
}: CalendarDayProps) {
  const isDisabled = !userId || isPastDate || disabled;

  return (
    <button
      type="button"
      onClick={() => onDateClick(dateStr)}
      disabled={isDisabled}
      className={`
        relative aspect-square rounded-lg font-medium text-sm
        transition-all duration-200
        ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"}
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
      <span>{date.getDate()}</span>
      {ngCount > 0 && !isSelected && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {ngCount}
        </span>
      )}
    </button>
  );
}
