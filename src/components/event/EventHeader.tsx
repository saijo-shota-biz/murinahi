import type { Event } from "@/app/model/Event";

interface EventHeaderProps {
  event: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="text-center mb-8">
      {event.title && <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>}
      <p className="text-lg md:text-xl text-gray-600 mb-2">
        <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent font-bold">
          参加できない日
        </span>
        をタップしてください
      </p>
    </div>
  );
}
