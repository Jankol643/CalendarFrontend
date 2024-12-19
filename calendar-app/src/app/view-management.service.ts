import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewManagementService {
  private currentViewSubject = new BehaviorSubject<string>('month'); // Default view
  currentView$ = this.currentViewSubject.asObservable();

  setView(view: string): void {
    this.currentViewSubject.next(view);
  }
}
