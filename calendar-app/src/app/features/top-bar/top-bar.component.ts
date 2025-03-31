import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CalendarView } from 'angular-calendar';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    imports: [CommonModule, FormsModule]
})
export class TopBarComponent {
  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() previous = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @Input() view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onViewChange(view: CalendarView) {
    this.viewChange.emit(view);
  }
}