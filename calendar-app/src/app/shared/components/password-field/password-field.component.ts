import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PasswordFieldComponent {
  @Input() control!: FormControl;
  @Input() label: string = 'Password';
  @Input() id: string = 'password';

  hide: boolean = true;

  toggleHide() {
    this.hide = !this.hide;
  }
}