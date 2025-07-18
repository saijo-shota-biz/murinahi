export interface Event {
  id: string;
  participants: Record<
    string,
    {
      ng_dates: string[];
    }
  >;
  createdAt: string;
}
