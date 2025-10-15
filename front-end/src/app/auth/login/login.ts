import { Component, inject } from '@angular/core';
import { AuthSection } from "../auth-section/auth-section";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [AuthSection, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/) // Solo letras, números, guiones y guiones bajos
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]]
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return; // Prevenir múltiples envíos
    }

    this.isSubmitting = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/index/tasks']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Invalid credentials';
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Must be at least ${requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `Must be at most ${requiredLength} characters`;
    }
    if (control.hasError('pattern')) {
      if (controlName === 'username') {
        return 'Invalid username format';
      }
    }

    return 'Invalid field';
  }
}