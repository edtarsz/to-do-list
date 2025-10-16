import { Component, inject } from '@angular/core';
import { AuthSection } from "../auth-section/auth-section";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [AuthSection, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  constructor() {
    this.setupForm();
  }

  private setupForm() {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/) // Solo letras y un espacio
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/) // Solo letras y un espacio
      ]],
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

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) return; // prevenir múltiples envíos

    this.isSubmitting = true;
    const { name, lastName, username, password } = this.registerForm.value;

    this.authService.register(name, lastName, username, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Registration failed';
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Must be at least ${control.getError('minlength').requiredLength} characters`;
    if (control.hasError('maxlength'))
      return `Must be at most ${control.getError('maxlength').requiredLength} characters`;

    if (control.hasError('pattern')) {
      if (controlName === 'name' || controlName === 'lastName')
        return 'Only letters and one space are allowed (no numbers or special characters)';
      if (controlName === 'username')
        return 'Only letters, numbers, hyphens and underscores allowed';
    }

    return 'Invalid field';
  }
}
