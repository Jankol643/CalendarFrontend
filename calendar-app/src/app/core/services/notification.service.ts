import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface NotificationOptions {
  message: string;
  action?: string;
  duration?: number;
  onAction?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  public showNotification(options: NotificationOptions): void {
    const snackBarRef = this.snackBar.open(options.message, options.action, {
      duration: options.duration ?? 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    if (options.onAction && options.action) {
      snackBarRef.onAction().subscribe(() => {
        options.onAction!();
      });
    }
  }
}