import axios, { AxiosInstance } from 'axios';
import { CreateEventParams, Event, EventCardPreview, SearchParams, Ticket } from '@/constants/Types';
import { FriendRequestStatus } from '@/constants/FriendRequestRespondEnum';
import { router } from 'expo-router';

const PROD_URL = 'https://eventbuddy.bsite.net/api/v1';
const DEV_URL = 'http://localhost:5196/api/v1';

const BASE_URL = DEV_URL;

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
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if(axios.isAxiosError(error) && error.response?.status === 401){
                    this.clearToken();
                    router.replace("/sign-in");
                }
                return Promise.reject(error);
            }
        );
    }

    setToken(token: string) {
        this.token = token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearToken() {
        this.token = null;
        delete this.client.defaults.headers.common['Authorization'];
    }

    async getEvent(eventID: number): Promise<{events: Event, similarEvents: EventCardPreview[], organizerEvents: EventCardPreview[]} | null>
    {
        try
        {
            const response = await this.client.get(`/events/${eventID}`);
            return response.data;
        }
        catch (error)
        {
            console.error('Error while fetching event: ', error);
            return null;
        }
    }

    async getFeed(user_id:number) : Promise<Record<string,EventCardPreview[]>>{
        try {
            const response = await this.client.get(`/events?user_id=${user_id}`);
            const sections: Record<string, EventCardPreview[]> = {};
            
            // Transform each event into the correct format
            for (const [key, events] of Object.entries(response.data)) {
                sections[key] = (events as any[]).map(event => ({
                    id: event.id,
                    title: event.title,
                    imageUrl: event.imageUrl,
                    description: event.description,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    savedAmount: event.savedAmount,
                    eventSaved: event.eventSaved,
                    matchScore: event.matchScore
                }));
            }
            
            console.log("Processed Sections:", sections);
            return sections;
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return {
                    "Für dich": [],
                    "In deiner Nähe": []
                };
            }
            throw error;
        }
    }
    async saveEvent(user_id:number, event_id:number): Promise<void>
    {
        try
        {
            const response = await this.client.post(`/saved_events/${event_id}/${user_id}`);
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
                    imageUrl: response.data[i].imageUrl,
                    description: response.data[i].description,
                    startDate: response.data[i].startDate,
                    endDate: response.data[i].endDate,
                    savedAmount: response.data[i].savedAmount,
                    eventSaved: response.data[i].eventSaved,
                    matchScore: response.data[i].matchScore
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
            const response = await this.client.post(`/events`, createEventParams);
        }
        catch (error)
        {
            console.error('Error while creating event: ', error);
        }
    }

    async register(username: string, email: string, phone: string, password: string, buddyName: string, preferredEventSize: number, preferredInteractivity: number, preferredNoisiness: number, preferredCrowdedness: number, preferredMusicStyles: string[], preferredEventTypes: string[]): Promise<{} | null> {
        try {
            const response = await this.client.post('/users/register', {
                id: 0,
                username,
                email,
                phone,
                password,
                buddyName,
                preferredEventSize,
                preferredInteractivity,
                preferredNoisiness,
                preferredCrowdedness,
                preferredMusicStyles,
                preferredEventTypes,
                userActivityLevel: 0,
                socialScore: 0,
                lastActiveDate: new Date().toISOString(),
                eventsAttended: 0,
                sentFriendRequests: [],
                receivedFriendRequests: [],
                friendships: []
            });
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            return null;
        }
    }

    async login(username: string, password: string): Promise<{ user_id: number, token: string } | null> {
        try {
            const response = await this.client.post(`/users/login?username=${username}&password=${password}`);
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

    async search(user_id : number, q: string): Promise<{users: object[]; events :object[]} | null>
    {
        try{
            const response = await this.client.get(`/search?user_id=${user_id}&q=${q}`);
            console.log({users: response.data.users, events: response.data.events});
            return {users: response.data.users, events: response.data.events};
        } catch (error) {
            console.error("Error in search:", error);
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

    async sendFriendRequest(fromUserId: number, toUserId: number): Promise<boolean> {
        try {
            const response = await this.client.post(`/friend_requests/send?fromUserId=${fromUserId}&toUserId=${toUserId}`);
            return response.status === 200;
        } catch (error) {
            console.error('Error sending friend request:', error);
            return false;
        }
    }

    async respondFriendRequest(userId: number, requestId: number, status: FriendRequestStatus): Promise<boolean> {
        try {
            const response = await this.client.post(`/friend_requests/respond?user_id=${userId}&requestId=${requestId}&status=${status.toString()}`);
            return response.status === 200;
        } catch (error) {
            console.error('Error responding to friend request:', error);
            return false;
        }
    }

    async getFriendRequests(userId: number): Promise<any[] | string> {
        try {
            const response = await this.client.get(`/users/received_friend_requests?user_id=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting friend requests:', error);
            return [];
        }
    }

    async getUserFriends(userId: number): Promise<any[] | string> {
        try {
            const response = await this.client.get(`/users/friends?user_id=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user friends:', error);
            return [];
        }
    }

    async removeFriend(userId: number, friendId: number): Promise<string> {
        try {
            const response = await this.client.delete(`/users/friends/delete?user_id=${userId}&friend_id=${friendId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing friend:', error);
            return 'An error occurred while removing the friend.';
        }
    }

    async addEvent(createEventParams: CreateEventParams): Promise<void> {
        console.log(createEventParams);
        try {
            const response = await this.client.post('/events', createEventParams);
            console.log('Event added successfully:', response.data);
        } catch (error) {
            console.error('Error while adding event:', error);
            throw error;
        }
    }

    async getUserTickets(userId: number): Promise<Ticket[]> {
        try {
            const response = await this.client.get(`/tickets/${userId}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            return [];
        }
    }

    async purchaseTicket(userId: number, eventId: number): Promise<any> {
        const response = await this.client.post('/tickets/purchase', {
            userId: userId,
            eventId: eventId
        });
        return response.data;
    }

    async verifyTicket(qrCode: string): Promise<any> {
        try {
            console.log(qrCode);
            const response = await this.client.post('/tickets/verify', { QRCode: qrCode });
            return response;
        } catch (error) {
            console.error('Error verifying ticket:', error);
            throw error;
        }
    }

    async getUser(userId: number): Promise<any> {
        try {
            const response = await this.client.get(`/users?user_id=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<string> {
        try {
            const response = await this.client.put('/users/change_password', { user_id: userId, current_password: currentPassword, new_password: newPassword });
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    async deleteUser(userId: number, password: string): Promise<string> {
        try {
            const response = await this.client.delete(`/users/delete?user_id=${userId}&password=${password}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

export default new NetworkClient();
