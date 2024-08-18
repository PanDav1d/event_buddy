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
    tags: string[]
}

export interface SearchParams {
  tags: string[],
  latitude: number,
  longitude: number,
  date_range: {
    start: Date;
    end: Date;
  };
  radius: number,
}