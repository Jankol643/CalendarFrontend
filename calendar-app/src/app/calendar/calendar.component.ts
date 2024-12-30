import { Component, OnInit } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { CommonModule } from "@angular/common";
import { ViewManagementService } from "../view-management.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [DayViewComponent, WeekViewComponent, MonthViewComponent, CommonModule],
})
export class CalendarComponent implements OnInit {
  currentView: string = 'month';

  constructor(private viewManagementService: ViewManagementService) { }

  ngOnInit() {
    this.viewManagementService.currentViewObservable.subscribe(view => {
      this.currentView = view;
    });
  }
}
