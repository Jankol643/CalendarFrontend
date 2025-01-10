import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, EventFormComponent],
  standalone: true
})
export class SidebarComponent {
  showEventForm: boolean = false;
  isSidebarVisible: boolean = true;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  openModal() {
    this.showEventForm = true;
  }

  closeModal() {
    this.showEventForm = false;
  }
}