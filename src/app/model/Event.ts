export interface Event {
  id: string;
  title?: string;
  participants: Record<
    string,
    {
      ng_dates: string[];
    }
  >;
  createdAt: string;
}
