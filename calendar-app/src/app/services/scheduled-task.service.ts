// scheduled-task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduledTaskModel } from '../model/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaskService {
  private baseEndpoint = `${environment.apiUrl}/scheduled-tasks`;

  constructor(private http: HttpClient) { }

  getScheduledTasks(uploadId?: string): Observable<ScheduledTaskModel[]> {
    let headers = new HttpHeaders();
    if (uploadId) {
      headers = headers.set('X-Upload-ID', uploadId);
    }

    return this.http.get<ScheduledTaskModel[]>(this.baseEndpoint, { headers });
  }

  getScheduledTasksByCalendar(calendarId: number): Observable<ScheduledTaskModel[]> {
    return this.http.get<ScheduledTaskModel[]>(`${environment.apiUrl}/calendars/${calendarId}/scheduled-tasks`);
  }
}