export interface EventCard {
    id: number,
    title: string,
    organizer: string,
    description: string,
    image_url: string,
    unix_time: number,
    location: string,
    latitude: number;
    longitude: number;
    tags: string[],
    is_saved: boolean,
    amount_saved: number,
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