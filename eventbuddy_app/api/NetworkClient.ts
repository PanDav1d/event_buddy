import axios, { AxiosInstance } from 'axios';
import { CreateEventParams, EventCard, EventCardPreview, SearchParams } from '@/constants/Types';
import * as Crypto from 'expo-crypto';

const BASE_URL = 'http://localhost:5196/api/v1';

class NetworkClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    setToken(token: string) {
        this.token = token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearToken() {
        this.token = null;
        delete this.client.defaults.headers.common['Authorization'];
    }

    async getEvent(eventID: number): Promise<EventCard | null>
    {
        try
        {
            const response = await this.client.get<EventCard>(`/events/${eventID}`);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching event: ', error);
            return null;
        }
    }

    async getEvents(user_id:number) : Promise<EventCardPreview[]>{
        try{
            const response = await this.client.get(`/events?user_id=${user_id}`);
            let result : EventCardPreview[] = []
            for(let i = 0; i < response.data.length; i++){
                const item = {
                    id: response.data[i].eventId,
                    title: response.data[i].eventTitle,
                    image_url: response.data[i].eventImageUrl,
                    description: response.data[i].eventDescription,
                    start_date: response.data[i].eventStartDate,
                    end_date: response.data[i].eventEndDate,
                    interested_friends: response.data[i].eventInterestedFriends,
                    amount_saved: response.data[i].savedAmount,
                    is_saved: response.data[i].eventSaved,
                };
                result.push(item);
            }
            console.log(result);
            return result;
        }
        catch (error)
        {
            console.error("Error while getting events: ", error);
            return [];
        }
    }

    async saveEvent(user_id:number, event_id:number): Promise<void>
    {
        try
        {
            await this.client.post(`/saved_events/${event_id}/${user_id}`);
        }
        catch (error)
        {
            console.error('Error while saving event: ', error);
        }
    }

    async getSavedEvents(user_id:number): Promise<EventCardPreview[]>
    {
        try
        {
            const response = await this.client.get(`/saved_events/${user_id}`);
            let result : EventCardPreview[] = []
            for(let i = 0; i < response.data.length; i++){
                const item : EventCardPreview = {
                    id: response.data[i].id,
                    title: response.data[i].title,
                    image_url: response.data[i].imageUrl,
                    description: response.data[i].description,
                    start_date: response.data[i].startDate,
                    end_date: response.data[i].endDate,
                    interested_friends: response.data[i].interestedFriends,
                    amount_saved: response.data[i].savedAmount,
                    is_saved: response.data[i].eventSaved,
                };
                result.push(item);
            }
            return result;
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

    async register(username: string, email: string, password: string): Promise<{ user_id: number, token: string } | null> {
        try {
            const response = await this.client.post('/users/register', { username, email, password });
            if (response.data.access_token) {
                this.setToken(response.data.access_token);
                return { user_id: response.data.user_id, token: response.data.access_token };
            }
            return null;
        } catch (error) {
            console.error('Error during registration:', error);
            return null;
        }
    }

    async login(username: string, password: string): Promise<{ user_id: number, token: string } | null> {
        try {
            console.log("Logging in with username:", username);
            const response = await this.client.post(`/users/login?username=${username}&password=${password}`);
            console.log("Response data:", response.data);
            if (response.data.access_token) {
                console.log("Received token:", response.data.access_token);
                this.setToken(response.data.access_token);
                console.log("Token set in NetworkClient");
                return { user_id: response.data.user_id, token: response.data.access_token };
            }
            return null;
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

    async refreshToken(): Promise<string | null> {
        try {
            const response = await this.client.post('/refresh-token');
            const newToken = response.data.access_token;
            this.setToken(newToken);
            return newToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
    
}

export default new NetworkClient();