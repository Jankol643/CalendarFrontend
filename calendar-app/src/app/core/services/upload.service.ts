import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export interface UploadItem {
  id: string; // Unique ID for matching event/task pair
  progress$: Subject<number>;
  cancel$: Subject<void>;
  subscription?: Subscription;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private uploads = new Map<string, UploadItem>();
  private eventIdMap = new Map<string, string>();

  constructor(private http: HttpClient) { }

  /**
   * Initiates an upload process.
   * @param formData - Data to upload.
   * @param uploadUrl - Endpoint URL.
   * @param uploadType - 'event' or 'task' for differentiation.
   */
  startUpload(
    formData: FormData,
    uploadUrl: string,
    uploadType: 'event' | 'task'
  ): UploadItem {
    // Generate or retrieve an existing event identifier
    let id = localStorage.getItem('upload_id');

    if (!id) {
      id = this.generateUUID();
      localStorage.setItem('upload_id', id);
    }
    if (uploadType === 'event' && id) {
      id = this.generateUUID();
      localStorage.setItem('upload_id', id);
    }

    const progress$ = new Subject<number>();
    const cancel$ = new Subject<void>();

    // Create headers with the id
    let headers = new HttpHeaders().set('X-Upload-ID', id);

    // Include headers in the HttpRequest
    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
      headers,
      withCredentials: true // add this line
    });

    const uploadItem: UploadItem = { id, progress$, cancel$ };
    this.uploads.set(id, uploadItem);

    const subscription = this.http.request(req).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentDone = Math.round(100 * (event.loaded / event.total));
          progress$.next(percentDone);
        } else if (event.type === HttpEventType.Response) {
          progress$.complete();
          this.removeUpload(id);
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
        progress$.error(error);
        this.removeUpload(id);
      }
    });

    // Handle cancellation
    cancel$.pipe(take(1)).subscribe(() => {
      subscription.unsubscribe();
      progress$.complete();
      this.removeUpload(id);
    });

    uploadItem.subscription = subscription;
    return uploadItem;
  }

  /**
   * Cancels an ongoing upload.
   * @param id - Upload ID.
   */
  cancelUpload(id: string): void {
    const upload = this.uploads.get(id);
    if (upload) {
      upload.cancel$.next();
    }
  }

  /**
   * Removes an upload from internal storage.
   * @param id - Upload ID.
   */
  private removeUpload(id: string): void {
    this.uploads.delete(id);
  }

  /**
   * Creates an unique identifier (UUID version 4) based on RFC4122.
   * Useful for generating unique IDs.
   */
  private generateUUID(): string {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    // Replace each 'x' and 'y' with random hexadecimal digits
    return template.replace(/[xy]/g, (char) => {
      const randomNum = Math.random() * 16; // random number between 0 and 15
      const r = Math.floor(randomNum); // convert to integer

      if (char === 'x') {
        // For 'x', use the random number directly
        return r.toString(16);
      } else {
        // For 'y', set the first bits to 8, 9, a, or b
        const v = (r & 0x3) | 0x8;
        return v.toString(16);
      }
    });
  }
}