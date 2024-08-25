import axios, { AxiosInstance } from 'axios';
import { CreateEventParams, EventCard, SearchParams } from '@/constants/Types';

const BASE_URL = 'https://eventbuddy.pythonanywhere.com/api/v1';

class NetworkClient {
    private client: AxiosInstance;

    constructor(){
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    async getEvents(searchParams : SearchParams, user_id : number): Promise<EventCard[]>
    {
        console.log(searchParams);
        try
        {
            const response = await this.client.get<EventCard[]>('/events.json/' + user_id, { params: searchParams});
            console.log('Response: ', response.data);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching events: ', error);
            return [];
        }
    }

    async saveEvent(user_id:number, event_id:number): Promise<void>
    {
        try
        {
            const response = await this.client.post(`/saved_events.json/${user_id}/${event_id}`);
            console.log('Response: ', response.data);
        }
        catch (error)
        {
            console.error('Error while saving event: ', error);
        }
    }

    async getSavedEvents(user_id:number): Promise<EventCard[]>
    {
        try
        {
            const response = await this.client.get<EventCard[]>(`/saved_events.json/${user_id}`);
            console.log('Response: ', response.data);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching saved events: ', error);
            return [];
        }
    }

    async createEvent(createEventParams: CreateEventParams): Promise<void>
    {
        try
        {
            const response = await this.client.post(`/event.json`, createEventParams);
            console.log('Response: ', response.data);
        }
        catch (error)
        {
            console.error('Error while creating event: ', error);
        }
    }
}

export default new NetworkClient();