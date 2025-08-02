"use client";

import { useState } from "react";
import { createEvent } from "@/app/actions";
import { Button, Input } from "@/components/ui";
import { useClipboard } from "@/hooks";

interface EventFormProps {
  onEventCreated: (url: string) => void;
}

export function EventForm({ onEventCreated }: EventFormProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { copyToClipboard } = useClipboard();

  const genUrl = (eventId: string) => {
    return `${window.location.origin}/event/${eventId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const eventId = await createEvent(eventTitle);
      const url = genUrl(eventId);
      onEventCreated(url);
      await copyToClipboard(url);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        placeholder="イベント名（例：新年会、旅行計画）"
        maxLength={50}
        variant="large"
        className="w-full"
      />
      <Button
        type="submit"
        loading={isCreating}
        size="lg"
        className="group relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200 -z-10"></div>
        <span className="relative z-10">
          {isCreating ? (
            "作成中..."
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>イベント作成</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              イベントを作る
            </>
          )}
        </span>
      </Button>
    </form>
  );
}
