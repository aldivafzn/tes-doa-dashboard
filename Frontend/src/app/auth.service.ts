import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor() { 
    this.initializeInterceptor();
  }

  // Store authentication token
  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Get authentication token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Remove authentication token
  removeToken(): void {
    sessionStorage.removeItem('token');
  }

  initializeInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
