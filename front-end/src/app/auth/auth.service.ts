import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Role, UserDTO } from '../models/user';

interface AuthResponse {
    access_token: string;
    user: UserDTO;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api';

    currentUser = signal<UserDTO | null>(null);
    isAuthenticated = signal(false);
    isLoading = signal(false);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.checkAuth();
    }

    register(name: string, lastName: string, username: string, password: string) {
        this.isLoading.set(true);

        const userDTO: UserDTO = { name, lastName, username, password };

        return this.http.post(`${this.apiUrl}/auth/register`, userDTO).pipe(
            tap(() => this.isLoading.set(false)),
            catchError((err) => {
                this.isLoading.set(false);

                if (err.status === 400 && err.error?.message) {
                    console.error('Errores de validación:', err.error.message);
                    return throwError(() => err.error.message.join(', '));
                }

                console.error('Error inesperado:', err);
                return throwError(() => err.error?.message || 'Error desconocido');
            })
        );
    }

    login(username: string, password: string) {
        this.isLoading.set(true);

        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
            username,
            password
        }).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access_token);
                this.currentUser.set(response.user);
                this.isAuthenticated.set(true);
                this.isLoading.set(false);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    logout() {
        localStorage.removeItem('access_token');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private checkAuth() {
        const token = this.getToken();
        if (token) {
            this.isLoading.set(true);

            this.http.get<UserDTO>(`${this.apiUrl}/auth/me`)
                .subscribe({
                    next: (user) => {
                        this.currentUser.set(user);
                        this.isAuthenticated.set(true);
                        this.isLoading.set(false);
                    },
                    error: () => {
                        this.logout();
                        this.isLoading.set(false);
                    }
                });
        }
    }

    private handleError(error: HttpErrorResponse) {
        this.isLoading.set(false);

        let errorMessage = 'Ocurrió un error';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
        } else if (error.status === 401) {
            errorMessage = 'Credenciales inválidas';
        } else if (error.status === 409) {
            errorMessage = 'El email ya está registrado';
        }

        return throwError(() => new Error(errorMessage));
    }
}