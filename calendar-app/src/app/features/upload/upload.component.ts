import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import { LineNumberedTextareaComponent } from '../../line-numbered-textarea/line-numbered-textarea.component';
import { ScheduleService } from '../../services/schedule.service';
import { CSVInputComponent } from '../csvinput/csvinput.component';
import { Router } from '@angular/router';
import { UploadService } from '../../core/services/upload.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

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
    CSVInputComponent,
    NavbarComponent
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy, OnInit {
  // Use FormControl for better reactive form handling
  adjustToCurrentDateControl = new FormControl(false);

  // Store subscription for cleanup
  private adjustDateSubscription?: Subscription;
  private uploadIdSubscription?: Subscription;

  hasUploadId: boolean = false;

  @ViewChild(CSVInputComponent) csvInputComponent!: CSVInputComponent;
  @ViewChild(LineNumberedTextareaComponent) textareaComponent!: LineNumberedTextareaComponent;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private uploadService: UploadService
  ) {
    // Subscribe to changes in the toggle
    this.adjustDateSubscription = this.adjustToCurrentDateControl.valueChanges.subscribe(
      (value) => {
        this.onAdjustDateToggle(value);
      }
    );
  }

  ngOnInit(): void {
    // Check initial state
    this.checkUploadId();

    // Subscribe to upload service changes if you have an observable for upload state
    // Or listen to storage events
    this.uploadIdSubscription = new Subscription();

    // Listen to storage events to detect upload ID changes
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.adjustDateSubscription) {
      this.adjustDateSubscription.unsubscribe();
    }
    if (this.uploadIdSubscription) {
      this.uploadIdSubscription.unsubscribe();
    }

    // Remove event listener
    window.removeEventListener('storage', this.handleStorageChange.bind(this));

    // Clear the upload ID from localStorage
    localStorage.removeItem('upload_id');
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'upload_id') {
      this.checkUploadId();
    }
  }

  private checkUploadId(): void {
    const uploadId = localStorage.getItem('upload_id');
    this.hasUploadId = !!uploadId;

    // Disable/enable the toggle based on upload ID
    if (this.hasUploadId) {
      this.adjustToCurrentDateControl.disable();
    } else {
      this.adjustToCurrentDateControl.enable();
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

  startScheduling(): void {
    this.scheduleService.startScheduling().pipe(
      tap((response) => {
        console.log('Scheduling completed:', response);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        console.error('Scheduling error:', error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  private onAdjustDateToggle(value: boolean | null): void {
    if (value === null) return;
    console.log(`Adjust dates to current date: ${value}`);
  }
}