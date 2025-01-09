import { Component, OnInit } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { CommonModule } from "@angular/common";
import { ViewManagementService } from "../view-management.service";
import { TopBarComponent } from "../topbar/topbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CalendarService } from "../services/calendar.service";

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
    CommonModule
  ],
})
export class CalendarComponent implements OnInit {
  opened: boolean = true;
  currentView: string = 'month';
  events: any[] = [];

  constructor(private viewManagementService: ViewManagementService, private calendarService: CalendarService) { }

  ngOnInit() {
    this.viewManagementService.currentViewObservable.subscribe(view => {
      this.currentView = view;
    });
    this.fetchEvents();
  }
  fetchEvents() {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  /**
   * Randomises the background color of the body
   */
  changeBackgroundColor() {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
    document.getElementById("number")!.innerHTML = randomColor;
  };

}
