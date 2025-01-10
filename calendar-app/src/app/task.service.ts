import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskEndpoint = 'http://localhost:8000/api/tasks';

  constructor(private http: HttpClient) { }

  createTask(task: any): Observable<any> {
    return this.http.post(this.taskEndpoint, task);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.taskEndpoint}/${id}`);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.taskEndpoint}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.taskEndpoint}/${id}`);
  }
}