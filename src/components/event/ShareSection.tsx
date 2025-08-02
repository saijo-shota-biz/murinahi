"use client";

import { useClipboard } from "@/hooks/useClipboard";
import { useClipboardSupport } from "@/hooks/useClipboardSupport";

export function ShareSection() {
  const { copyToClipboard, justCopied } = useClipboard();
  const { clipboardSupported } = useClipboardSupport();

  const handleCopyUrl = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);

    if (!success) {
      alert(`コピーに失敗しました。URL: ${url}`);
    }
  };

  if (!clipboardSupported) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">このURLを共有してメンバーを招待</p>
        <button
          type="button"
          onClick={handleCopyUrl}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>URLをコピー</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {justCopied ? "コピーしました！" : "URLをコピー"}
        </button>
      </div>
    </div>
  );
}
