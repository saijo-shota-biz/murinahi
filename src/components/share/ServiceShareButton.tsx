"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ShareIcon } from "./ShareIcon";
import { ShareModal } from "./ShareModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleShareClick} variant={variant} size={size} className={`${className}`}>
        <ShareIcon className="mr-2" />
        ムリな日カレンダーを友達に教える
      </Button>

      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} url={url} title={title} />
    </>
  );
}
