"use client";

import { useClipboard } from "@/hooks/useClipboard";
import { useClipboardSupport } from "@/hooks/useClipboardSupport";
import { TwitterShareButton, CopyShareButton } from "@/components/share";

interface ShareSectionProps {
  event?: { id: string };
}

export function ShareSection({ event }: ShareSectionProps) {
  const { copyToClipboard, justCopied } = useClipboard();
  const { clipboardSupported } = useClipboardSupport();

  const handleCopyUrl = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);

    if (!success) {
      alert(`コピーに失敗しました。URL: ${url}`);
    }
  };

  const shareUrl = event 
    ? `https://murinahi.vercel.app/event/${event.id}` 
    : "https://murinahi.vercel.app";

  if (!clipboardSupported) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
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
      
      <div className="border-t border-gray-200/50 pt-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-full mb-3">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
              気に入っていただけましたか？
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            ムリな日カレンダーをお友達にもシェアしていただけると嬉しいです✨
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <TwitterShareButton url={shareUrl} variant="primary" />
          <CopyShareButton url={shareUrl} variant="secondary" />
        </div>
      </div>
    </div>
  );
}
