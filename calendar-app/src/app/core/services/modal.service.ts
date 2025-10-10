import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventDetailComponent } from '../../features/calendar/event-detail/event-detail.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) { }

  showItemDetail(event: CalendarEvent): MatDialogRef<EventDetailComponent> {
    console.log(JSON.stringify(event));
    return this.dialog.open(EventDetailComponent, {
      data: { event },
      // Crucial: Add this to handle the data correctly
      disableClose: false, //Optional, prevents closing the dialog by clicking outside
      width: '500px', // Optional: Adjust dialog width as needed
      height: 'auto' // Optional: Adjust dialog height as needed
    });
  }
}