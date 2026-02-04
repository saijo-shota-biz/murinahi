"use client";

interface InputCompletedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function InputCompletedToggle({ checked, onChange, disabled }: InputCompletedToggleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            ${checked ? "bg-red-500" : "bg-gray-200"}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
              transform transition duration-200 ease-in-out
              ${checked ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
        <span className={`text-sm font-medium ${checked ? "text-red-600" : "text-gray-700"}`}>入力できた</span>
      </div>
      <p className="mt-2 text-xs text-gray-500">こちらをONにしておくと他の参加者に入力が終わったことを伝えられます</p>
    </div>
  );
}
