import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarComponent } from '../calendar/calendar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [TopBarComponent, SidebarComponent, CalendarComponent, MatSidenavModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = true;
  isMobileView = false;
  sidenavMode: 'side' | 'over' = 'side';

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Centralized toggle method that always toggles the current state
  toggleSidebar() {
    if (this.isMobileView) {
      // On mobile, toggling opens/closes overlay
      this.isSidebarOpen = !this.isSidebarOpen;
    } else {
      // On desktop, toggle always
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobileView = window.innerWidth < 975;
    if (this.isMobileView) {
      this.sidenavMode = 'over'; // overlay mode on mobile
      this.isSidebarOpen = false; // default closed on mobile
    } else {
      this.sidenavMode = 'side'; // permanent side on desktop
      this.isSidebarOpen = true; // default open on desktop
    }
  }

  // Optional: update open state based on user interactions with sidenav
  onSidenavChange(opened: boolean) {
    this.isSidebarOpen = opened;
  }
}