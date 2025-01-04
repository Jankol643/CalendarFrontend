// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Login user and get JWT token
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Get the authenticated user
  getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // Logout user
  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  // Store token in local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Refresh token
  refreshToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/refresh`, {}, { headers });
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true; // Token is not present, consider it expired
    }

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true; // No expiration claim, consider it expired
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < currentTime; // Check if the token is expired
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decodedPayload = atob(payload); // Decode the base64 payload
    return JSON.parse(decodedPayload); // Parse the JSON string into an object
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token); // Check if the token is not expired
  }
}
