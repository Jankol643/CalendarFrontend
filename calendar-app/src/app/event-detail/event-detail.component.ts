import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ModalService } from '../modal.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EventDetailComponent implements OnInit {
  @Input() event: CalendarEvent | null = null;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.modalService.event$.subscribe((event) => {
      this.event = event;
      const modalEl = document.getElementById('eventDetailModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }

  close() {
    const modalEl = document.getElementById('eventDetailModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
  }
}