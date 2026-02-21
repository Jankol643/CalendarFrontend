import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../../../environments/environment';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-csvinput',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './csvinput.component.html',
  styleUrls: ['./csvinput.component.scss']
})
export class CSVInputComponent {
  @Input() uploadType: 'event' | 'task' = 'event';
  @Input() adjustToCurrentDate: boolean = false;

  uploadProgressMap: Map<string, number> = new Map();
  public requiredFileType = ['txt', 'csv'];

  fileName: string | null = null;
  currentUploadId: string | null = null;

  constructor(private uploadService: UploadService) { }

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

      // Include the adjustToCurrentDate setting
      formData.append('adjustToCurrentDate', this.adjustToCurrentDate.toString());

      const uploadItem = this.uploadService.startUpload(
        formData,
        `${environment.apiUrl}/CSVInput`,
        uploadType
      );

      this.currentUploadId = uploadItem.id;
      this.uploadItemProgressSubscription(uploadItem, uploadItem.id);
    }
  }

  uploadText(uploadType: 'event' | 'task', adjustToCurrentDate: boolean = false): void {
    // Use the passed parameter or fall back to component property
    const adjustDate = adjustToCurrentDate !== undefined ? adjustToCurrentDate : this.adjustToCurrentDate;

    const textarea = document.getElementById('textarea') as HTMLTextAreaElement | null;
    const textContent = textarea?.value;
    if (textContent == null || textContent.trim() === '') {
      return;
    }

    this.fileName = 'Text Input';

    const formData = new FormData();
    formData.append(`${uploadType}_input`, new Blob([textContent], { type: 'text/plain' }), 'text_input.txt');
    formData.append('adjustToCurrentDate', adjustDate.toString());
    console.log(formData);

    const uploadItem = this.uploadService.startUpload(
      formData,
      `${environment.apiUrl}/CSVInput`,
      uploadType
    );

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