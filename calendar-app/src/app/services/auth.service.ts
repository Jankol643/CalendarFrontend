// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth'; // Adjust the URL as needed

  constructor(private http: HttpClient, private router: Router) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // New method to get a user by ID (changed id to number)
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`); // Adjust the endpoint as needed
  }

  // New method to update a user (changed id to number)
  update(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user); // Adjust the endpoint as needed
  }
}
