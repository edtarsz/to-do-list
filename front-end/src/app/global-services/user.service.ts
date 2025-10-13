import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiURL = 'http://localhost:3000/api/users';
    private httpClient = inject(HttpClient);

    // Signal para un solo usuario
    user = signal<User | null>(null);

    updateUser(id: number, payload: Partial<User>): Observable<User> {
        const previousUser = this.user();

        if (previousUser) {
            this.user.set({ ...previousUser, ...payload });
        }

        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<User>(url, payload).pipe(
            tap(updatedUser => {
                this.user.set(updatedUser);
            }),
            catchError(error => {
                this.user.set(previousUser);
                return throwError(() => error);
            })
        );
    }
}