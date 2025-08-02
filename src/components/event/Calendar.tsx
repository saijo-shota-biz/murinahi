import { CalendarNavigation } from "./CalendarNavigation";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarStatus } from "./CalendarStatus";

interface CalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDates: Set<string>;
  onDateClick: (date: string) => void;
  getNGCountForDate: (date: string) => number;
  userId: string | null;
  isSaving: boolean;
  showSaveSuccess: boolean;
  saveError: string | null;
}

export function Calendar({
  currentMonth,
  onMonthChange,
  selectedDates,
  onDateClick,
  getNGCountForDate,
  userId,
  isSaving,
  showSaveSuccess,
  saveError,
}: CalendarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <CalendarNavigation currentMonth={currentMonth} onMonthChange={onMonthChange} />

      <CalendarGrid
        currentMonth={currentMonth}
        selectedDates={selectedDates}
        onDateClick={onDateClick}
        getNGCountForDate={getNGCountForDate}
        userId={userId}
      />

      <CalendarStatus isSaving={isSaving} showSaveSuccess={showSaveSuccess} saveError={saveError} />
    </div>
  );
}
