import axios, { AxiosInstance } from 'axios';
import { CreateEventParams, EventCard, SearchParams } from '@/constants/Types';
import * as Crypto from 'expo-crypto';

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

    async getEvent(eventID: number): Promise<EventCard | null>
    {
        try
        {
            const response = await this.client.get<EventCard>(`/event.json/${eventID}`);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching event: ', error);
            return null;
        }
    }
    async getEvents(searchParams : SearchParams, user_id : number): Promise<EventCard[]>
    {
        try
        {
            const response = await this.client.get<EventCard[]>('/events.json/' + user_id, { params: searchParams});
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
        }
        catch (error)
        {
            console.error('Error while creating event: ', error);
        }
    }

    async register(username: string, email: string, password: string): Promise<{ user_id: number } | null> {
        try {
            const response = await this.client.post('/register', { username, email, password })
            return response.data
        } catch (error) {
            console.error('Error during registration:', error)
            return null
        }
    }


    async login(username: string, password: string): Promise<{ user_id: number } | null> {
        try {
            const response = await this.client.post('/login', { username, password });
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }

    async getSearchResults(text: string): Promise<{ id: string; title: string; }[]>
    {
        try {
            const response = await this.client.post('/search', { text });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error during search:', error);
            return [];
        }
    }
}

export default new NetworkClient();