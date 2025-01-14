import { Component, OnInit } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { CommonModule } from "@angular/common";
import { ViewManagementService } from "../view-management.service";
import { TopBarComponent } from "../topbar/topbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CalendarService } from "../services/calendar.service";
import { EventFormComponent } from "../event-form/event-form.component";
import { EventService } from "../event.service";
import { TaskService } from "../task.service"; // Import TaskService if needed

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    DayViewComponent,
    WeekViewComponent,
    MonthViewComponent,
    TopBarComponent,
    SidebarComponent,
    EventFormComponent,
    CommonModule
  ],
})
export class CalendarComponent implements OnInit {
  opened: boolean = true;
  currentView: string = 'month';
  showEventForm: boolean = false;
  calendars: { id: number, title: string; visible: boolean }[] = [];
  events: any[] = []; // Store events here

  constructor(
    private viewManagementService: ViewManagementService,
    private eventService: EventService,
    private calendarService: CalendarService,
    private taskService: TaskService // Inject TaskService if needed
  ) { }

  ngOnInit() {
    // Subscribe to view changes
    this.viewManagementService.currentViewObservable.subscribe(view => {
      this.currentView = view;
    });

    // Fetch calendars from the CalendarService
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars.map((calendar: any) => ({ ...calendar, visible: false }));
    });
  }

  onEventsChanged(events: any[]) {
    this.events = events; // Update events when sidebar emits new events
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  changeBackgroundColor() {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
    document.getElementById("number")!.innerHTML = randomColor;
  }

  // Method to handle calendar visibility and fetch events
  handleCalendarToggle(calendar: { id: number, title: string, visible: boolean }) {
    calendar.visible = !calendar.visible; // Toggle visibility
    if (calendar.visible) {
      this.eventService.getEvents(calendar.id).subscribe(events => {
        this.onEventsChanged(events); // Update events when fetched
      });
    }
  }
}