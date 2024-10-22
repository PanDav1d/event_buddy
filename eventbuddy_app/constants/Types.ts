export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  organizerId: number;
  soldTickets: number;
  maxTickets: number;
  eventSize: number;
  interactivity: number;
  noisiness: number;
  crowdedness: number;
  musicStyles: string[];
  eventType: string;
  attendeeCount: number;
  averageRating: number;
  eventSaved: boolean;
  savedAmount: number;
  matchScore: number;
}

export interface EventCardPreview {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  eventSaved: boolean;
  savedAmount: number;
  matchScore: number;
}

export interface CreateEventParams {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  organizerId: number;
  startDate: string;
  endDate: string;
  soldTickets: number;
  maxTickets: number;
  eventSize: number;
  interactivity: number;
  noisiness: number;
  crowdedness: number;
  musicStyles: string[];
  eventType: string;
  attendeeCount: number;
  averageRating: number;
  attendees: [];
}

export interface SearchParams {
  userId: number;
  startDate: string;
  endDate: string;
}


export interface Ticket
{
    id: number;
    eventId: number;
    createdAt: string;
    qrCode: string;
}