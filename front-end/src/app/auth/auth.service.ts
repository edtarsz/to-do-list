import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';
import { Role, UserDTO } from '../models/user';
import { AuthStateService } from '../global-services/auth-state.service';
import { ListService } from '../global-services/lists.service';

interface AuthResponse {
    access_token: string;
    user: UserDTO;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authStateService = inject(AuthStateService);
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
                this.http.get<UserDTO>(`${this.apiUrl}/auth/me`)
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

        const userDTO: UserDTO = { name, lastName, username, password };

        return this.http.post(`${this.apiUrl}/auth/register`, userDTO).pipe(
            tap(() => this.authStateService.setLoading(false)),
            catchError((err) => {
                this.authStateService.setLoading(false);

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
        this.authStateService.setLoading(true);

        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
            username, password
        }).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access_token);
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
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private handleError(error: HttpErrorResponse) {
        this.authStateService.setLoading(false);

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