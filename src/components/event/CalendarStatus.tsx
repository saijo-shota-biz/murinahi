import { LoadingSpinner } from "@/components/ui";

interface CalendarStatusProps {
  isSaving: boolean;
  showSaveSuccess: boolean;
  saveError: string | null;
}

export function CalendarStatus({ isSaving, showSaveSuccess, saveError }: CalendarStatusProps) {
  return (
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
          <LoadingSpinner size="sm" />
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

      {saveError && (
        <div className="flex items-center gap-1 text-red-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>保存エラー</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{saveError}</span>
        </div>
      )}
    </div>
  );
}
