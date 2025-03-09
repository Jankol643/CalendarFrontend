import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-flash-message',
    imports: [],
    templateUrl: './flash-message.component.html',
    styleUrl: './flash-message.component.scss'
})
export class FlashMessageComponent {
  @Input() message: string = '';
  @Output() undoEvent = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<void>();

  undo() {
    this.undoEvent.emit();
  }

  close() {
    this.closeEvent.emit();
  }
}
