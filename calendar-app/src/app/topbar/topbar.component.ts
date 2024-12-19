import { Component } from '@angular/core';
import { CalendarNavigationService } from '../calendar-navigation.service';
import { ViewManagementService } from '../view-management.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatIconModule]
})
export class TopBarComponent {
  constructor(private calendarService: CalendarNavigationService, private viewManagementService: ViewManagementService) { }

  previousMonth() {
    this.calendarService.previousMonth();
  }

  nextMonth() {
    this.calendarService.nextMonth();
  }

  today() {
    this.calendarService.today();
  }

  setView(view: string) {
    this.viewManagementService.setView(view);
  }

}
