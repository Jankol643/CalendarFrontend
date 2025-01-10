import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventEndpoint = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get(this.eventEndpoint);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(this.eventEndpoint, event);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.eventEndpoint}/${id}`);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.eventEndpoint}/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.eventEndpoint}/${id}`);
  }
}