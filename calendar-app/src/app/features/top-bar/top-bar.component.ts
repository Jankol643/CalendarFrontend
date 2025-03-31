import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CalendarStateService } from '../../services/calendar-state.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatToolbarModule, MatButtonToggleModule]
})
export class TopBarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  constructor(private authService: AuthService, private router: Router, private calendarStateService: CalendarStateService) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
}