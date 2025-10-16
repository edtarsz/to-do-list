import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/internal/operators/tap";
import { catchError, Observable, throwError } from "rxjs";
import { List } from "../models/list";
import { environment } from "../../enviroments/environment";

@Injectable({
    providedIn: 'root'
})
export class ListService {
    private apiURL = `${environment.BACK_END_URL}/api/lists`;
    private httpClient = inject(HttpClient);

    lists = signal<List[]>([]);
    readonly lists$ = this.lists.asReadonly();

    addList(list: List): Observable<List> {
        const tempId = Date.now();
        const tempList: List = { ...list, id: tempId };

        this.lists.update(currentLists => [...currentLists, tempList]);

        return this.httpClient.post<List>(this.apiURL, list).pipe(
            tap(confirmedList => {
                this.lists.update(currentLists =>
                    currentLists.map(t =>
                        t.id === tempId ? confirmedList : t
                    )
                );
            }),
            catchError(error => {
                this.lists.update(currentLists =>
                    currentLists.filter(t => t.id !== tempId)
                );
                return throwError(() => error);
            })
        );
    }

    deleteList(id: number): Observable<void> {
        const previousLists = this.lists();

        this.lists.update(currentLists => currentLists.filter(t => t.id !== id));

        const url = `${this.apiURL}/${id}`;
        return this.httpClient.delete<void>(url).pipe(
            catchError(error => {
                this.lists.set(previousLists);
                return throwError(() => error);
            })
        );
    }

    updateList(id: number, payload: Partial<List>): Observable<List> {
        const previousLists = this.lists();

        this.lists.update(currentLists =>
            currentLists.map(t =>
                // If the task ID matches, merge the existing task with the payload to create an updated task
                t.id === id ? { ...t, ...payload } : t
            )
        );

        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<List>(url, payload).pipe(
            tap(updatedList => {
                this.lists.update(currentLists =>
                    currentLists.map(t =>
                        t.id === id ? updatedList : t
                    )
                );
            }),
            catchError(error => {
                this.lists.set(previousLists);
                return throwError(() => error);
            })
        );
    }

    getLists(): Observable<List[]> {
        const url = this.apiURL;
        return this.httpClient.get<List[]>(url).pipe(tap(res => this.lists.set(res)));
    }

    getListById(id: number): Observable<List> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.get<List>(url).pipe();
    }

    clear() {
        this.lists.set([]);
    }
}