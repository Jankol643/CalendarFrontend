import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initRegForm();
  }

  private initRegForm() {
    this.registrationForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    } as AbstractControlOptions);
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('password_confirmation')?.value
      ? null : { mismatch: true };
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  get passwordFieldType(): string {
    return this.fieldTextType ? 'text' : 'password';
  }

  get repeatPasswordFieldType(): string {
    return this.repeatFieldTextType ? 'text' : 'password';
  }

  get passwordIconClass(): string {
    return this.fieldTextType ? 'bi-eye' : 'bi-eye-slash';
  }

  get repeatPasswordIconClass(): string {
    return this.repeatFieldTextType ? 'bi-eye' : 'bi-eye-slash';
  }

  public onSubmit() {
    if (this.registrationForm.invalid) {
      console.error('Form invalid');
      return;
    }

    this.authService.register(this.registrationForm.value)
      .subscribe({
        next: (data: any) => {
          this.router.navigate(['/login']);
        },
        error: (err) => console.error(err)
      });
  }
}