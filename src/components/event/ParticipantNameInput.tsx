"use client";

import { useState, useEffect } from "react";

interface ParticipantNameInputProps {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

export function ParticipantNameInput({ value, onChange, disabled }: ParticipantNameInputProps) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    // フォーカスが外れた時に保存
    onChange(localValue);
  };

  return (
    <div className="mb-6">
      <label htmlFor="participant-name" className="block text-sm font-medium text-gray-700 mb-2">
        お名前（任意）
        <span className="ml-2 text-xs text-gray-500">入力しない場合は「ななしさん」と表示されます</span>
      </label>
      <input
        id="participant-name"
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="例: 田中"
        maxLength={20}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
      />
      {localValue.length > 15 && <p className="mt-1 text-xs text-gray-500">残り{20 - localValue.length}文字</p>}
    </div>
  );
}
