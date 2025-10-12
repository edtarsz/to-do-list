import { Component, inject } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { InterfaceService } from '../../global-services/interface.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../global-services/auth-state.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  private interfaceAuthService = inject(AuthStateService);
  private router = inject(Router);

  private fb = inject(FormBuilder);

  updateUserForm!: FormGroup;

  closeIcon = this.iconRegistryService.getIcon('close');

  constructor() {
    this.updateUserForm = this.fb.group({
      name: [this.interfaceAuthService.user()!.name, [Validators.required, Validators.minLength(2)]],
      lastName: [this.interfaceAuthService.user()!.lastName, [Validators.required, Validators.minLength(2)]],
      username: [this.interfaceAuthService.user()!.username, [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.updateUserForm.valid) {
      //   const { name, lastName, username, password } = this.updateUserForm.value;

      //   this.authService.updateUser(name, lastName, username, password).subscribe({
      //     next: () => {
      //       this.successMessage = 'Perfil actualizado exitosamente. Redirigiendo...';
      //       this.errorMessage = '';
      //       this.router.navigate(['/login']);
      //     },
      //     error: (error) => {
      //       this.errorMessage = error.message;
      //       this.successMessage = '';
      //     }
      //   });
      // } else {
      //   this.registerForm.markAllAsTouched();
    }
  }


  closeUpdateProfile() {
    this.interfaceService.setShowUpdateProfile(false);
    this.router.navigate(['/index/tasks']);
  }

  get user() {
    return this.interfaceAuthService.user()!;
  }
}
