import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewManagementService } from '../view-management.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from 'rxjs';
import { DateService } from '../date.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatIconModule]
})
export class TopBarComponent implements OnInit, OnDestroy {
  currentView: string = 'month';
  private viewSubscription: Subscription = new Subscription();

  constructor(private dateService: DateService, private viewManagementService: ViewManagementService) { }

  ngOnInit() {
    // Subscribe to the current view observable
    this.viewSubscription = this.viewManagementService.currentViewObservable.subscribe(view => {
      this.currentView = view; // Store the current view
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.viewSubscription.unsubscribe();
  }

  previous() {
    // Call the appropriate method based on the current view
    this.currentView === 'day' ? this.dateService.previousDay() :
      this.currentView === 'week' ? this.dateService.previousWeek() :
        this.dateService.previousMonth();
  }

  next() {
    // Call the appropriate method based on the current view
    this.currentView === 'day' ? this.dateService.nextDay() :
      this.currentView === 'week' ? this.dateService.nextWeek() :
        this.dateService.nextMonth();
  }

  today() {
    this.dateService.today();
  }

  setView(view: string) {
    this.viewManagementService.setView(view);
  }
}