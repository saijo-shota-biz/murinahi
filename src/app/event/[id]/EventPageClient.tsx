import { EventPage } from "@/components/event";
import type { Event } from "@/types/Event";

interface EventPageClientProps {
  event: Event;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  return <EventPage event={event} />;
}
