import { CommonModule } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { catchError, finalize, retry, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { CalendarStateService } from '../../services/calendar-state.service';
import { ErrorHandlerService } from "../../services/error-handler.service";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatToolbarModule, MatButtonToggleModule]
})
export class TopBarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  private baseEndpoint = `${environment.apiUrl}`;
  private readonly MAX_RETRIES = 3;

  constructor(private authService: AuthService, private router: Router, private calendarStateService: CalendarStateService, private errorHandlerService: ErrorHandlerService, private http: HttpClient) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onViewChange(view: CalendarView) {
    this.calendarStateService.setView(view);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onNavigationChange(action: string) {
    this.calendarStateService.setNavigationAction(action);
  }

  public export() {
    console.log('Fetching export...');
    console.debug(this.baseEndpoint);
    console.time('Export Data');

    this.http.get(`${this.baseEndpoint}/export`).pipe(
      retry(this.MAX_RETRIES),
      tap((response) => {
        console.log('Export request successful', response);
      }),
      catchError(error => {
        console.error('Export request failed:', error);
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => console.timeEnd('Export Data'))
    ).subscribe(); // ADD THIS SUBSCRIBE
  }

  private downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported-file.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public generateMockData() {

  }

}