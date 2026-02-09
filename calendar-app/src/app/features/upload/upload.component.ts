import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LineNumberedTextareaComponent } from '../../line-numbered-textarea/line-numbered-textarea.component';
import { ScheduleService } from '../../services/schedule.service';
import { CSVInputComponent } from '../csvinput/csvinput.component';

@Component({
  selector: 'app-upload',
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    LineNumberedTextareaComponent,
    CSVInputComponent
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy {
  // Use FormControl for better reactive form handling
  adjustToCurrentDateControl = new FormControl(false);

  // Store subscription for cleanup
  private adjustDateSubscription?: Subscription;

  @ViewChild(CSVInputComponent) csvInputComponent!: CSVInputComponent;
  @ViewChild(LineNumberedTextareaComponent) textareaComponent!: LineNumberedTextareaComponent;

  constructor(private scheduleService: ScheduleService) {
    // Subscribe to changes in the toggle
    this.adjustDateSubscription = this.adjustToCurrentDateControl.valueChanges.subscribe(
      (value) => {
        this.onAdjustDateToggle(value);
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.adjustDateSubscription) {
      this.adjustDateSubscription.unsubscribe();
    }
  }

  // Getter for template binding
  get adjustToCurrentDate(): boolean {
    return this.adjustToCurrentDateControl.value ?? false;
  }

  triggerUploadText(type: 'event' | 'task') {
    // Pass the adjustToCurrentDate value to the CSVInputComponent
    this.csvInputComponent.uploadText(type, this.adjustToCurrentDate);
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
    });
  }

  private onAdjustDateToggle(value: boolean | null): void {
    if (value === null) return;

    console.log(`Adjust dates to current date: ${value}`);
  }
}