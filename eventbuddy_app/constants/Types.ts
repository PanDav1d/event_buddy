export interface EventCard {
  id: number;
  title: string;
  organizer_id: number;
  description: string;
  image_url: string;
  start_time: number;
  end_time: number;
  location: string;
  latitude: number;
  longitude: number;
  tags: string[];
  is_saved: boolean;
  amount_saved: number;
  interestedFriends: string[];
  category: string;
}

export interface EventCardPreview {
  id: number;
  title: string;
  image_url : string,
  description: string;
  start_date: Date;
  end_date: Date;
  interested_friends: string[];
  amount_saved: number;
  is_saved: boolean;
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