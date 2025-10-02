// auth/auth.state.ts
import { Injectable, signal, computed } from '@angular/core';
import { UserDTO, Role } from '../models/user';

export interface AuthState {
    user: UserDTO | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {
    private state = signal<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false
    });

    user = computed(() => this.state().user);
    isAuthenticated = computed(() => this.state().isAuthenticated);
    isLoading = computed(() => this.state().isLoading);

    userName = computed(() => {
        const user = this.user();
        return user ? `${user.name} ${user.lastName}` : '';
    });

    setUser(user: UserDTO | null) {
        this.state.update(s => ({ ...s, user, isAuthenticated: !!user }));
    }

    setLoading(isLoading: boolean) {
        this.state.update(s => ({ ...s, isLoading }));
    }

    clear() {
        this.state.set({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    }
}