import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth'; // Adjust the URL as needed
  private currentUserSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize the BehaviorSubject with the current user value
    this.currentUserSubject = new BehaviorSubject<User | null>(this.userValue);
    this.user = this.currentUserSubject.asObservable();
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<{ access_token: string; user: User }> {
    return this.http.post<{ access_token: string; user: User }>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null); // Update the BehaviorSubject
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get userValue(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
