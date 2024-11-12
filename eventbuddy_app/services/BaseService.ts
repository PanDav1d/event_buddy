import { Enviroment } from '@/enviroments/enviroment.prod';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getToken() {
  return await AsyncStorage.getItem('authToken');
}

export class BaseService<T> {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: Enviroment.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    this.loadToken();
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorStatus: number = error.response?.status;
        if (axios.isAxiosError(error) && errorStatus === 401) {
          this.clearToken();
          router.replace("/sign-in");
        } else if (errorStatus.toString().startsWith("5")) {
          this.clearToken();
          console.log("Server error");
        }
        return Promise.reject(error);
      }
    );
  }

  public setToken(token: string) {
    this.token = token;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public clearToken() {
    this.token = null;
    delete this.instance.defaults.headers.common['Authorization'];
  }

  public async loadToken() {
    const savedToken = await AsyncStorage.getItem('authToken');
    if (savedToken) {
      this.setToken(savedToken);
    }
  }

  protected async get(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return (await this.instance.get(endpoint, config)).data.payload;
  }
  protected async post(endpoint: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return (await this.instance.post(endpoint, config)).data.payload;
  }
}
