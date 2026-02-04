"use server";

import { createEvent as createEventService } from "@/services/eventService";
import { updateParticipant as updateParticipantService } from "@/services/participantService";

export async function createEvent(title?: string, startDate?: string, endDate?: string) {
  return await createEventService(title, startDate, endDate);
}

export async function updateParticipant(
  eventId: string,
  userId: string,
  ngDates: string[],
  name?: string,
  inputCompleted?: boolean,
) {
  return await updateParticipantService(eventId, userId, ngDates, name, inputCompleted);
}
