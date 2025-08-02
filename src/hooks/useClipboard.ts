"use client";

import { useState, useCallback } from "react";

export function useClipboard() {
  const [justCopied, setJustCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
      return true;
    } catch (err) {
      console.error("URLのコピーに失敗しました:", err);
      return false;
    }
  }, []);

  return { copyToClipboard, justCopied };
}
