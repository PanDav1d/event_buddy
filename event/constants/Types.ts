export interface EventCard {
  id: number;
  title: string;
  organizer_id: number; // assuming you might want to reference the organizer ID
  description: string;
  image_url: string;
  start_time: number; // changed from unix_time to start_time
  end_time: number; // added to represent the event's end time
  location: string; // you can define a more specific type if needed
  latitude: number;
  longitude: number;
  tags: string[];
  is_saved: boolean;
  amount_saved: number;
  interestedFriends: string[];
  category: string;
}


export interface CreateEventParams{
  title: string,
  unix_time: number,
  location: string,
  description: string,
  latitude: number,
  longitude: number,
  organizer: number,
  image_url: string,
}

export interface SearchParams {
  tags: string[],
  latitude: number,
  longitude: number,
  start_date: number;
  end_date: number;
  radius: number,
}