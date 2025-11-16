import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { LineNumberedTextareaComponent } from '../../line-numbered-textarea/line-numbered-textarea.component';
import { ScheduleService } from '../../services/schedule.service';
import { CSVInputComponent } from '../csvinput/csvinput.component';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatTabsModule, LineNumberedTextareaComponent, CSVInputComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  @ViewChild(CSVInputComponent) csvInputComponent!: CSVInputComponent;

  constructor(private scheduleService: ScheduleService) { }

  triggerUploadText(type: 'event' | 'task') {
    this.csvInputComponent.uploadText(type);
  }

  startScheduling() {
    const result$ = this.scheduleService.startScheduling();

    result$.subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Error during scheduling:', error);
      }
    })
  }
}
