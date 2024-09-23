import axios, { AxiosInstance } from 'axios';
import { CreateEventParams, EventCard, SearchParams } from '@/constants/Types';
import * as Crypto from 'expo-crypto';

const BASE_URL = 'https://eventbuddy.pythonanywhere.com/api/v1';

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
            const response = await this.client.get<EventCard>(`/event.json/${eventID}`);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching event: ', error);
            return null;
        }
    }
    async getEvents(searchParams: SearchParams, user_id: number): Promise<{[category: string]: EventCard[]}> {
        try {
            console.log(searchParams);
            const response = await this.client.get<EventCard[]>(`/events.json/${user_id}`, { params: searchParams });
            const eventsByCategory: {[category: string]: EventCard[]} = {};
            const categories = await this.client.get<string[]>('/categories.json');

            for (const category of categories.data){
                console.log(category);
                for (const event of response.data){
                    if (event.category === category){
                        if (!eventsByCategory[category]){
                            eventsByCategory[category] = [];
                        }
                        eventsByCategory[category].push(event);
                    }
                }
            }
            return eventsByCategory;
        } catch (error) {
            console.error('Error while fetching events: ', error);
            return {};
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

    async register(username: string, email: string, password: string): Promise<{ user_id: number, token: string } | null> {
        try {
            const response = await this.client.post('/register', { username, email, password });
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
            const response = await this.client.post('/login', { username, password });
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
    async getCategories(): Promise<string[]> {
        try {
            const response = await this.client.get<string[]>('/categories.json');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async getForYou(user_id: number): Promise<EventCard[]> {
        try {
            const response = await this.client.get(`/start/foryou/${user_id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching for you:', error);
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