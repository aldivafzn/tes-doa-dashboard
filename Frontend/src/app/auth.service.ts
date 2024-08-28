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
    localStorage.setItem('token', token);
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove authentication token
  removeToken(): void {
    localStorage.removeItem('token');
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
