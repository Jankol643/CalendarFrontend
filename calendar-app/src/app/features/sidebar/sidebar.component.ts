import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../services/calendar.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  opened: boolean = true;
  @Output() onEventsChanged = new EventEmitter<number[]>();
  calendars: { id: number; title: string; visible: boolean }[] = [];
  showCalendars: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(private calendarService: CalendarService, private dialog: MatDialog) { } // Inject MatDialog

  ngOnInit(): void {
    this.loadCalendars();
  }

  loadCalendars(): void {
    const calendarSubscription = this.calendarService.getCalendars().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.calendars = response.data.map((calendar: any) => ({
            ...calendar,
            visible: true
          }));
          this.emitVisibleCalendars();
        } else {
          console.error('Unexpected response format:', response);
          this.calendars = [];
        }
      },
      error: (error) => {
        console.error('Error fetching calendars:', error);
      }
    });
    this.subscriptions.add(calendarSubscription);
  }

  toggleCalendars(): void {
    this.showCalendars = !this.showCalendars;
  }

  toggleCalendarVisibility(calendar: { id: number; title: string; visible: boolean }): void {
    calendar.visible = !calendar.visible;
    this.emitVisibleCalendars();
  }

  emitVisibleCalendars(): void {
    const visibleCalendarIds = this.calendars
      .filter((cal) => cal.visible)
      .map((cal) => cal.id);
    this.onEventsChanged.emit(visibleCalendarIds);
  }

  openEventForm(): void {
    // Open the EventFormComponent as a dialog
    this.dialog.open(EventFormComponent, {
      width: '400px', // Optional: Set dialog width
      data: {} // Optional: Pass data to the dialog if needed
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleSidebar() {
    this.opened = !this.opened;
  }
}