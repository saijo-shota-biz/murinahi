"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ShareIcon } from "./ShareIcon";

interface ServiceShareButtonProps {
  url?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ServiceShareButton({
  url = "https://murinahi.com",
  variant = "secondary",
  size = "md",
  className = "",
}: ServiceShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `ムリな日カレンダー使ってみた！
日程調整がめっちゃ楽になる😊

調整さんより使いやすくて
誰でも簡単に参加できるのがいい✨

${url}

#ムリな日カレンダー #日程調整`;

  const handleShareClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Alt/Optionキーが押されている場合はクリップボードにコピー
    if (event.altKey || event.metaKey) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      // 通常はTwitter/Xシェアを開く
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <Button
        onClick={handleShareClick}
        variant={variant}
        size={size}
        className={`${className}`}
        title="クリック: Twitterでシェア | Alt/Cmd+クリック: テキストをコピー"
      >
        <ShareIcon className="mr-2" />
        {copied ? "コピーしました！" : "ムリな日カレンダーを友達に教える"}
      </Button>
    </>
  );
}