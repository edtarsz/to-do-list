import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStateService } from '../global-services/auth-state.service';

export const authGuard: CanActivateFn = () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    if (authStateService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const publicGuard: CanActivateFn = () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    if (!authStateService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/index/tasks']);
    return false;
};