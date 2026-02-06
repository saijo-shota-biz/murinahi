import { CalendarNavigation } from "./CalendarNavigation";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarStatus } from "./CalendarStatus";
import { ParticipantNameInput } from "./ParticipantNameInput";
import { InputCompletedToggle } from "./InputCompletedToggle";

interface CalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDates: Set<string>;
  onDateClick: (date: string) => void;
  getNGCountForDate: (date: string) => number;
  userId: string | null;
  participantName: string;
  onNameChange: (name: string) => void;
  inputCompleted: boolean;
  onInputCompletedChange: (completed: boolean) => void;
  isSaving: boolean;
  showSaveSuccess: boolean;
  saveError: string | null;
  startDate?: string;
  endDate?: string;
}

export function Calendar({
  currentMonth,
  onMonthChange,
  selectedDates,
  onDateClick,
  getNGCountForDate,
  userId,
  participantName,
  onNameChange,
  inputCompleted,
  onInputCompletedChange,
  isSaving,
  showSaveSuccess,
  saveError,
  startDate,
  endDate,
}: CalendarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <ParticipantNameInput value={participantName} onChange={onNameChange} disabled={isSaving || inputCompleted} />

      <InputCompletedToggle checked={inputCompleted} onChange={onInputCompletedChange} disabled={isSaving} />

      <CalendarNavigation currentMonth={currentMonth} onMonthChange={onMonthChange} />

      <CalendarGrid
        currentMonth={currentMonth}
        selectedDates={selectedDates}
        onDateClick={onDateClick}
        getNGCountForDate={getNGCountForDate}
        userId={userId}
        disabled={inputCompleted}
        startDate={startDate}
        endDate={endDate}
      />

      <CalendarStatus isSaving={isSaving} showSaveSuccess={showSaveSuccess} saveError={saveError} />
    </div>
  );
}
