import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent {
  @Input() date: Date = new Date();
  @Input() events: { time: string; title: string }[] = [];

  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);
}