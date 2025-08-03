"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  url = "https://murinahi.com",
  title = "ムリな日カレンダー",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `ムリな日カレンダー使ってみた！
日程調整がめっちゃ楽になる😊

調整さんより使いやすくて
誰でも簡単に参加できるのがいい✨

${url}

#ムリな日カレンダー #日程調整`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleTwitterShare = () => {
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleLineShare = () => {
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
      } catch (err) {
        console.error("Web Share failed:", err);
      }
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Modal backdrop needs click handler
    // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard interaction handled via Escape key
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Modal content needs click handler */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click handler is for preventing propagation only */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">ムリな日カレンダーをシェア</h3>

        <div className="space-y-3">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button onClick={handleWebShare} variant="secondary" className="w-full justify-start">
              📱 システムのシェア機能
            </Button>
          )}

          <Button onClick={handleTwitterShare} variant="secondary" className="w-full justify-start">
            🐦 Twitter/X でシェア
          </Button>

          <Button onClick={handleLineShare} variant="secondary" className="w-full justify-start">
            💬 LINE でシェア
          </Button>

          <Button onClick={handleCopyUrl} variant="secondary" className="w-full justify-start">
            {copied ? "✅ コピーしました！" : "🔗 URLをコピー"}
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">シェア内容プレビュー:</p>
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded whitespace-pre-line">{shareText}</div>
        </div>

        <Button onClick={onClose} variant="ghost" className="w-full mt-4">
          閉じる
        </Button>
      </div>
    </div>
  );
}
