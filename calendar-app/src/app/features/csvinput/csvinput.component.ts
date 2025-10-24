import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-csvinput',
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatTabsModule],
  templateUrl: './csvinput.component.html',
  styleUrl: './csvinput.component.scss'
})
export class CSVInputComponent {
  @Input()
  requiredFileType: string | undefined;
  @Input() uploadType: 'event' | 'task' = 'event'; // default to 'event'
  @Input() onUploadText: () => void = () => { };

  private baseEndpoint = `${environment.apiUrl}/CSVInput`;

  fileName = '';
  uploadProgress!: number | null;
  uploadSub!: Subscription | null;

  constructor(private http: HttpClient) {

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append(`${this.uploadType}_input`, file);

      const upload$ = this.http.post(this.baseEndpoint, formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        finalize(() => this.reset())
      );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type === HttpEventType.UploadProgress && event.total !== undefined) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      }, error => {
        // Handle upload error
        console.error('Upload failed', error);
        this.reset();
      });
    }
  }

  cancelUpload() {
    if (this.uploadSub != null) {
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  uploadText() {
    console.log('Upload button clicked');
    const el = document.getElementById('textarea');
    console.log('Element', el);

    const text1 = (document.getElementById('textarea') as HTMLTextAreaElement)?.value;
    console.log(text1);

    if (text1 == null) {
      return;
    }

    const formData = new FormData();
    formData.append('event_input', new Blob([text1], { type: 'text/plain' }), 'text_input.txt');
    console.log('FormData: ', formData);

    const upload$ = this.http.post(this.baseEndpoint, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => this.reset())
    );

    this.uploadSub = upload$.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress && event.total !== undefined) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }
    });
  }
}
