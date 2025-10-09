import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskModel } from '../../model/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseEndpoint = `${environment.apiUrl}/calendars`;
  private deletedTask: { task: TaskModel; calendarId: number } | null = null;
  private taskDeletedSubject = new Subject<number>();
  public tasksChangedTask = new EventEmitter<number[]>();

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

  public storeDeletedTask(task: TaskModel, calendarId: number): void {
    this.deletedTask = { task, calendarId };
  }

  public undoDelete(): Observable<any> | null {
    if (this.deletedTask) {
      const { task, calendarId } = this.deletedTask;
      console.log('Restoring task:', task);
      this.deletedTask = null;
      console.log('Sending raw task for restore:', task);
      return this.http.post(`${this.baseEndpoint}/${calendarId}/tasks`, task).pipe(
        tap(response => {
          console.log('Restore response:', response);
        })
      );
    }
    return null;
  }

  public getTaskDeletedObservable(): Observable<number> {
    return this.taskDeletedSubject.asObservable();
  }
}