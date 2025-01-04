import { Component, OnInit } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { CommonModule, JsonPipe } from "@angular/common";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewManagementService } from "../view-management.service";
import { TopBarComponent } from "../topbar/topbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

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
    CommonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    JsonPipe],
})
export class CalendarComponent implements OnInit {
  opened: boolean = true;
  currentView: string = 'month';

  constructor(private viewManagementService: ViewManagementService) { }

  ngOnInit() {
    this.viewManagementService.currentViewObservable.subscribe(view => {
      this.currentView = view;
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }
}
