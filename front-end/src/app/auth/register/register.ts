import { Component, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { AuthSection } from "../auth-section/auth-section";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthStateService } from '../../global-services/auth-state.service';
import gsap from 'gsap';

@Component({
  selector: 'app-register',
  imports: [AuthSection, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  @ViewChild('loadingSvg') set loadingSvg(element: ElementRef | undefined) {
    if (element) {
      this._loadingSvg = element;
      this.startLoadingAnimation();
    }
  }

  private _loadingSvg?: ElementRef;

  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  startLoadingAnimation() {
    if (!this._loadingSvg) return;

    const svg = this._loadingSvg.nativeElement;
    const circles = svg.querySelectorAll('circle');

    gsap.to(svg, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      transformOrigin: '50% 50%'
    });

    gsap.to(circles, {
      strokeDashoffset: -205,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      stagger: 0.2
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, lastName, username, password } = this.registerForm.value;

      this.authService.register(name, lastName, username, password).subscribe({
        next: () => {
          this.successMessage = 'Cuenta creada exitosamente. Redirigiendo...';
          this.errorMessage = '';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.successMessage = '';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres`;
    }
    if (control.hasError('email')) {
      return 'Debe ser un email válido';
    }

    return 'Campo inválido';
  }

  get isLoading(): boolean {
    return this.authStateService.isLoading();
  }
}