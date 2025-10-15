import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';
import { User } from '../models/user';
import { AuthStateService } from '../global-services/auth-state.service';
import { ListService } from '../global-services/lists.service';
import { InterfaceService } from '../global-services/interface.service';

interface AuthResponse {
    access_token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authStateService = inject(AuthStateService);
    private interfaceService = inject(InterfaceService);
    private listService = inject(ListService);
    private apiUrl = 'http://localhost:3000/api';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    async initializeAuth(): Promise<void> {
        const token = this.getToken();
        if (!token) {
            this.authStateService.clear();
            return;
        }

        this.authStateService.setLoading(true);
        try {
            const user = await firstValueFrom(
                this.http.get<User>(`${this.apiUrl}/auth/me`)
            );
            this.authStateService.setUser(user);
        } catch (error) {
            this.authStateService.clear();
        } finally {
            this.authStateService.setLoading(false);
        }
    }

    register(name: string, lastName: string, username: string, password: string) {
        this.authStateService.setLoading(true);

        const user: User = { name, lastName, username, password };

        return this.http.post(`${this.apiUrl}/auth/register`, user).pipe(
            tap(() => {
                this.interfaceService.setEventActive(true);
                this.interfaceService.setEvent('REGISTER', 'Your account has been successfully created.');
                this.authStateService.setLoading(false);
            }),
            catchError((error: HttpErrorResponse) => {
                this.authStateService.setLoading(false);

                let errorMessage = 'There was an error creating your account.';

                // Manejar errores específicos del backend
                if (error.status === 400) {
                    if (error.error?.message) {
                        // Si el mensaje es un array de errores de validación
                        if (Array.isArray(error.error.message)) {
                            errorMessage = error.error.message.join(', ');
                        } else {
                            errorMessage = error.error.message;
                        }
                    }
                } else if (error.status === 409) {
                    // Usuario ya existe
                    errorMessage = 'Username already exists. Please choose a different username.';
                } else if (error.status === 0) {
                    errorMessage = 'Could not connect to the server. Please try again.';
                }

                this.interfaceService.setEventActive(true);
                this.interfaceService.setEvent('ERROR', errorMessage);

                console.error('Registration error:', error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    login(username: string, password: string) {
        this.authStateService.setLoading(true);

        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
            username, password
        }).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access_token);
                this.interfaceService.setEventActive(true);
                this.interfaceService.setEvent('LOGIN', `Welcome, ${response.user.name}!`);
                this.authStateService.setUser(response.user);
                this.authStateService.setLoading(false);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    logout() {
        localStorage.removeItem('access_token');
        this.authStateService.clear();
        this.listService.clear();
        this.interfaceService.closeAll();
        this.router.navigate(['/login']);
        this.interfaceService.setEventActive(true);
        this.interfaceService.setEvent('LOGOUT', "Catch you later! We'll miss you around here!");
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private handleError(error: HttpErrorResponse) {
        this.authStateService.setLoading(false);

        let errorMessage = 'An error occurred';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 0) {
            errorMessage = 'Could not connect to the server';
        } else if (error.status === 401) {
            errorMessage = 'Invalid credentials';
        } else if (error.status === 404) {
            errorMessage = 'User not found';
        }

        this.interfaceService.setEventActive(true);
        this.interfaceService.setEvent('ERROR', errorMessage);

        return throwError(() => new Error(errorMessage));
    }
}