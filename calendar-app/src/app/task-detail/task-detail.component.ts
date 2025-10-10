import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { TaskService } from '../core/services/task.service';
import { TaskModel } from '../model/models';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent {
  task: TaskModel;
  isEditing: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<TaskDetailComponent>, // Inject dialog ref
  ) {
    this.task = this.data.task;
  }

  // Navigate to edit page
  public editTask() {
    if (this.task?.id) {
      this.router.navigate(['/edit-task', this.task.id]);
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveTask();
      console.log('Saved task:', this.task);
    }
    this.isEditing = !this.isEditing;
  }

  private saveTask() {
    this.taskService.updateTask(this.task.calendarId, this.task.id, this.task).subscribe({
      next: () => {
        this.taskService.notifyTasksChanged([this.task.calendarId]);
        this.dialogRef.close();
        this.notificationService.showNotification({
          message: 'Task updated',
          duration: 5000
        });
      },
      error: (err: any) => {
        console.error('Delete failed', err);
        this.notificationService.showNotification({ message: 'Failed to update task' });
      }
    })
  }

  // Delete task and close dialog
  deleteTask() {
    if (this.task?.id && this.task?.calendarId) {
      const calendarId = this.task.calendarId;
      const taskId = Number(this.task.id);
      this.taskService.deleteTask(calendarId, taskId).subscribe({
        next: () => {
          this.taskService.notifyTasksChanged([calendarId]);

          // Show snackbar with Undo option
          this.notificationService.showNotification({
            message: 'Task deleted',
            action: 'Undo',
            duration: 5000,
            onAction: () => this.undoDelete()
          });

          // Store deleted task for possible undo
          this.taskService.storeDeletedTask(this.task, calendarId);

          // Close the modal after delete
          this.dialogRef.close();
        },
        error: (err: any) => {
          console.error('Delete failed', err);
          this.notificationService.showNotification({ message: 'Failed to delete task' });
        }
      });
    }
  }

  // Undo delete
  undoDelete() {
    const undoObservable = this.taskService.undoDelete();
    if (undoObservable) {
      undoObservable.subscribe({
        next: () => {
          if (this.task?.calendarId) {
            this.taskService.notifyTasksChanged([this.task.calendarId]);
            this.notificationService.showNotification({ message: 'Task restored' });
          }
        },
        error: () => this.notificationService.showNotification({ message: 'Restore failed' })
      });
    }
  }
}