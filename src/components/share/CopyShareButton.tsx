"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { getShareText } from "./shareUtils";

interface CopyShareButtonProps {
  url?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CopyShareButton({
  url = "https://murinahi.com",
  variant = "secondary",
  size = "md",
  className = "",
}: CopyShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      const shareText = getShareText(url);
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <svg
        className="mr-2"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
          fill="currentColor"
        />
      </svg>
      {copied ? "コピーしました！" : "ムリな日カレンダーの紹介文をコピー"}
    </Button>
  );
}