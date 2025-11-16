import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../../environments/environment';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-csvinput',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatTabsModule],
  templateUrl: './csvinput.component.html',
  styleUrls: ['./csvinput.component.scss']
})
export class CSVInputComponent {
  @Input() uploadType: 'event' | 'task' = 'event';

  // Map to track progress per upload id
  uploadProgressMap: Map<string, number> = new Map();
  public requiredFileType = ['txt', 'csv'];

  // Additional properties to manage UI state
  fileName: string | null = null;
  // Store current upload id
  currentUploadId: string | null = null;

  constructor(private uploadService: UploadService, private http: HttpClient) { }

  // Getter to derive current upload progress
  get uploadProgress(): number | null {
    if (this.currentUploadId && this.uploadProgressMap.has(this.currentUploadId)) {
      return this.uploadProgressMap.get(this.currentUploadId) || 0;
    }
    return null;
  }

  onFileSelected(event: any, uploadType: 'event' | 'task'): void {
    const file: File | undefined = event.target?.files?.[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append(`${uploadType}_input`, file);

      const uploadItem = this.uploadService.startUpload(formData, `${environment.apiUrl}/CSVInput`, uploadType);

      // Set currentUploadId to track progress
      this.currentUploadId = uploadItem.id;

      // Subscribe to progress updates
      this.uploadItemProgressSubscription(uploadItem, uploadItem.id);
    }
  }

  uploadText(uploadType: 'event' | 'task'): void {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement | null;
    const textContent = textarea?.value;
    if (textContent == null || textContent.trim() === '') {
      return;
    }

    this.fileName = 'Text Input';

    const formData = new FormData();
    formData.append(`${uploadType}_input`, new Blob([textContent], { type: 'text/plain' }), 'text_input.txt');

    const uploadItem = this.uploadService.startUpload(formData, `${environment.apiUrl}/CSVInput`, uploadType);

    // Set currentUploadId for progress tracking
    this.currentUploadId = uploadItem.id;

    this.uploadItemProgressSubscription(uploadItem, uploadItem.id);
  }

  cancelUpload(id: string): void {
    this.uploadService.cancelUpload(id);
    this.uploadProgressMap.delete(id);
    if (this.currentUploadId === id) {
      this.currentUploadId = null;
    }
    localStorage.removeItem('upload_id');
  }

  private uploadItemProgressSubscription(uploadItem: any, id: string): void {
    uploadItem.progress$.subscribe((progress: number) => {
      this.uploadProgressMap.set(id, progress);
      if (progress >= 100) {
        // Upload finished
        this.uploadProgressMap.delete(id);
        if (this.currentUploadId === id) {
          this.currentUploadId = null;
        }
      }
    });
  }

  reset(): void {
    this.fileName = null;
    this.uploadProgressMap.clear();
    this.currentUploadId = null;
    localStorage.removeItem('upload_id');
  }
}