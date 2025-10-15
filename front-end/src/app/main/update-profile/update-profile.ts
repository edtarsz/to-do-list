import { Component, inject } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { InterfaceService } from '../../global-services/interface.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../global-services/auth-state.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../global-services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-update-profile',
  imports: [IconTextButton, ReactiveFormsModule],
  templateUrl: './update-profile.html',
  standalone: true,
  styleUrl: './update-profile.css'
})
export class UpdateProfile {
  private iconRegistryService = inject(IconRegistryService);
  private interfaceService = inject(InterfaceService);
  private interfaceAuthStateService = inject(AuthStateService);
  private interfaceAuthService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  updateUserForm!: FormGroup;
  closeIcon = this.iconRegistryService.getIcon('close');
  errorMessage = '';
  isSubmitting = false;

  constructor() {
    const currentUser = this.interfaceAuthStateService.user();

    this.updateUserForm = this.fb.group({
      name: [currentUser?.name || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/)
      ]],
      lastName: [currentUser?.lastName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/)
      ]],
      username: [currentUser?.username || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/)
      ]],
      password: ['', [
        Validators.minLength(8),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['']
    });
  }

  onSubmit() {
    this.errorMessage = '';

    // Limpiar error de duplicate si existe
    if (this.updateUserForm.get('username')?.hasError('duplicate')) {
      const currentErrors = this.updateUserForm.get('username')?.errors;
      if (currentErrors) {
        delete currentErrors['duplicate'];
        const hasOtherErrors = Object.keys(currentErrors).length > 0;
        this.updateUserForm.get('username')?.setErrors(hasOtherErrors ? currentErrors : null);
      }
    }

    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const { name, lastName, username, password, confirmPassword } = this.updateUserForm.value;

    if (password && password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.updateUserForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.updateUserForm.get('confirmPassword')?.markAsTouched();
      return;
    }

    const payload = this.buildUpdateUserPayload(name, lastName, username, password);

    if (Object.keys(payload).length === 0) {
      this.errorMessage = 'No changes to save.';
      return;
    }

    const userId = this.user?.id;
    if (!userId) {
      this.errorMessage = 'User ID not found.';
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.userService.updateUser(+userId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.interfaceService.setEventActive(true);
        this.interfaceService.setEvent('SUCCESS', 'Profile updated successfully.');
        this.interfaceAuthService.initializeAuth();
        this.interfaceService.setShowUpdateProfile(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMsg = error.error?.message || error.message || 'An error occurred while updating the profile.';
        
        // Detectar error de username duplicado
        if (errorMsg.toLowerCase().includes('username')) {
          this.errorMessage = 'This username is already taken. Please choose another one.';
          this.updateUserForm.get('username')?.setErrors({ duplicate: true });
          this.updateUserForm.get('username')?.markAsTouched();
        } else {
          this.errorMessage = errorMsg;
        }
      }
    });
  }

  buildUpdateUserPayload(name: string, lastName: string, username: string, password: string) {
    const payload: Partial<User> = {};
    const currentUser = this.user;

    if (name && name !== currentUser?.name) payload.name = name;
    if (lastName && lastName !== currentUser?.lastName) payload.lastName = lastName;
    if (username && username !== currentUser?.username) payload.username = username;
    if (password && password.trim().length > 0) payload.password = password;

    return payload;
  }

  passwordMismatch(): boolean {
    const password = this.updateUserForm.get('password')?.value;
    const confirmPassword = this.updateUserForm.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return true;
    }
    return false;
  }

  closeUpdateProfile() {
    this.interfaceService.setShowUpdateProfile(false);
    this.router.navigate(['/index/tasks']);
  }

  get user() {
    return this.interfaceAuthStateService.user();
  }

  getErrorMessage(controlName: string): string {
    const control = this.updateUserForm.get(controlName);
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
      if (controlName === 'name') {
        return 'Only letters are allowed (no numbers, spaces or special characters)';
      }
      if (controlName === 'lastName') {
        return 'Only letters and one space are allowed (no numbers or special characters)';
      }
      if (controlName === 'username') {
        return 'Only letters, numbers, hyphens and underscores allowed';
      }
    }
    if (control.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    if (control.hasError('duplicate')) {
      return 'This username is already taken';
    }

    return 'Invalid field';
  }
}