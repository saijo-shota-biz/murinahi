interface MonthTabsProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthTabs({ currentMonth, onMonthChange }: MonthTabsProps) {
  const now = new Date();
  const currentMonthNumber = now.getMonth() + 1; // 1-12
  const nextMonthNumber = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;

  const monthTabs = [
    { label: `${currentMonthNumber}月`, date: new Date() },
    {
      label: `${nextMonthNumber}月`,
      date: new Date(now.getFullYear(), now.getMonth() + 1),
    },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {monthTabs.map((tab) => (
        <button
          type="button"
          key={tab.label}
          onClick={() => onMonthChange(tab.date)}
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
  );
}
