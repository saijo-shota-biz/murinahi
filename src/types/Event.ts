export interface Participant {
  ng_dates: string[];
  name?: string;
}

export interface Event {
  id: string;
  title?: string;
  participants: Record<string, Participant>;
  createdAt: string;
}
