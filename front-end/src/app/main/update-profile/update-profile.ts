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

  constructor() {
    const currentUser = this.interfaceAuthStateService.user();

    this.updateUserForm = this.fb.group({
      name: [currentUser?.name || '', [Validators.required, Validators.minLength(2)]],
      lastName: [currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
      username: [currentUser?.username || '', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.updateUserForm.valid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const { name, lastName, username, password, confirmPassword } = this.updateUserForm.value;

    // Validar que las contraseñas coincidan si se ingresó alguna
    if (password && password !== confirmPassword) {
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

    this.userService.updateUser(+userId, payload).subscribe({
      next: () => {
        this.interfaceService.setEventActive(true);
        this.interfaceService.setEvent('SUCCESS', 'Profile updated successfully.');
        this.interfaceAuthService.initializeAuth();
        this.interfaceService.setShowUpdateProfile(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while updating the profile.';
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

    // Solo mostrar error si ambos campos tienen contenido y no coinciden
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
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This is a required field';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Must be at least ${requiredLength} characters`;
    }

    return 'Invalid field';
  }
}