import { CommonModule } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarView } from 'angular-calendar';
import { environment } from "../../../environments/environment";
import { CalendarStateService } from '../../services/calendar-state.service';
import { ErrorHandlerService } from "../../services/error-handler.service";
import { AuthService } from '../auth/auth.service';
import { UserModel } from "../../model/models";
import { retry, tap, catchError, throwError, finalize } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from "@angular/material/select";


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSelectModule
  ],
})
export class TopBarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  user: UserModel | null = null;
  private baseEndpoint = `${environment.apiUrl}`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private calendarStateService: CalendarStateService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Subscribe to the user observable
    this.authService.currentUser$.subscribe({
      next: (user) => (this.user = user),
      error: () => (this.user = null),
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorHandlerService.handleError(err),
    });
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

    this.http.get(`${this.baseEndpoint}/export`, { responseType: 'blob' }).pipe(
      retry(3),
      tap((response) => {
        this.downloadFile(response);
        console.log('Export request successful');
      }),
      catchError((error) => {
        console.error('Export request failed:', error);
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => console.timeEnd('Export Data'))
    ).subscribe();
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
    // Implementation for mock data
  }

  public goToSettings() {
    this.router.navigate(['/settings']);
  }

  public goToProfile() {
    this.router.navigate(['user-profile']);
  }
}