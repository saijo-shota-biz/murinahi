"use client";

import { useState } from "react";
import type { Event } from "@/types/Event";
import { AnimatedBackground, GlobalStyles } from "@/components/common";
import { EventHeader } from "./EventHeader";
import { MonthTabs } from "./MonthTabs";
import { Calendar } from "./Calendar";
import { EventSummary } from "./EventSummary";
import { ShareSection } from "./ShareSection";
import { useEventState } from "@/hooks/useEventState";

interface EventPageProps {
  event: Event;
}

export function EventPage({ event }: EventPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const eventState = useEventState(event);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <AnimatedBackground />
      <GlobalStyles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <EventHeader event={event} />

        <MonthTabs currentMonth={currentMonth} onMonthChange={setCurrentMonth} />

        <Calendar
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          selectedDates={eventState.selectedDates}
          onDateClick={eventState.handleDateClick}
          getNGCountForDate={eventState.getNGCountForDate}
          userId={eventState.userId}
          participantName={eventState.participantName}
          onNameChange={eventState.handleNameChange}
          inputCompleted={eventState.inputCompleted}
          onInputCompletedChange={eventState.handleInputCompletedChange}
          isSaving={eventState.isSaving}
          showSaveSuccess={eventState.showSaveSuccess}
          saveError={eventState.saveError}
          startDate={event.startDate}
          endDate={event.endDate}
        />

        <EventSummary event={event} />

        <ShareSection event={event} />
      </div>
    </div>
  );
}
