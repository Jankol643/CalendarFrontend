import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewManagementService } from '../view-management.service';
import { CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { DateService } from '../date.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class TopBarComponent implements OnInit, OnDestroy {
  currentView: string = 'month';
  private viewSubscription: Subscription = new Subscription();

  constructor(private dateService: DateService, private viewManagementService: ViewManagementService, private authService: AuthService, private router: Router) { }

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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}