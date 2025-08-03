"use client";

import { Button } from "@/components/ui";
import { ShareIcon } from "./ShareIcon";

interface ServiceShareButtonProps {
  url?: string;
  title?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ServiceShareButton({
  url = "https://murinahi.com",
  title = "ムリな日カレンダー",
  variant = "secondary",
  size = "md",
  className = "",
}: ServiceShareButtonProps) {
  const shareText = `ムリな日カレンダー使ってみた！
日程調整がめっちゃ楽になる😊

調整さんより使いやすくて
誰でも簡単に参加できるのがいい✨

${url}

#ムリな日カレンダー #日程調整`;

  const handleShareClick = async () => {
    // モバイルでWeb Share APIが使える場合は直接シェア
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
      } catch (err) {
        // ユーザーがキャンセルした場合は何もしない
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Web Share failed:", err);
        }
      }
    } else {
      // デスクトップではTwitter/Xシェアを直接開く
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      onClick={handleShareClick}
      variant={variant}
      size={size}
      className={`${className}`}
    >
      <ShareIcon className="mr-2" />
      ムリな日カレンダーを友達に教える
    </Button>
  );
}