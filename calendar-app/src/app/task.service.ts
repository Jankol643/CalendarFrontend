import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getTasks(calendarId: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/${calendarId}/tasks`);
  }

  createTask(calendarId: number, task: any): Observable<any> {
    return this.http.post(`${this.baseEndpoint}/${calendarId}/tasks`, task);
  }

  getTaskById(calendarId: number, id: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/${calendarId}/tasks/${id}`);
  }

  updateTask(calendarId: number, id: number, task: any): Observable<any> {
    return this.http.put(`${this.baseEndpoint}/${calendarId}/tasks/${id}`, task);
  }

  deleteTask(calendarId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${calendarId}/tasks/${id}`);
  }
}