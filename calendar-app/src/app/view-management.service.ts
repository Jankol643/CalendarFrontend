import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewManagementService {
  private viewSubject = new BehaviorSubject<string>('month'); // Default view
  currentViewObservable = this.viewSubject.asObservable();

  setView(view: string): void {
    this.viewSubject.next(view);
  }
}
