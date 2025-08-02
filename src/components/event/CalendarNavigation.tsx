interface CalendarNavigationProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function CalendarNavigation({ currentMonth, onMonthChange }: CalendarNavigationProps) {
  const goToPreviousMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button type="button" onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>前の月へ</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h3 className="text-lg font-bold text-gray-800">
        {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
      </h3>

      <button type="button" onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>次の月へ</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
