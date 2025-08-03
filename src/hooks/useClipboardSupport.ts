"use client";

import { useEffect, useState } from "react";

export function useClipboardSupport() {
  const [clipboardSupported, setClipboardSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setClipboardSupported(typeof navigator !== "undefined" && !!navigator.clipboard && window.isSecureContext);
  }, []);

  return { clipboardSupported };
}
