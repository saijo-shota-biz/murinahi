import { EventPage } from "@/components/event";
import type { Event } from "@/app/model/Event";

interface EventPageClientProps {
  event: Event;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  return <EventPage event={event} />;
}
