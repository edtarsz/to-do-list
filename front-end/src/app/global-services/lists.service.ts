import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/internal/operators/tap";
import { Observable } from "rxjs";
import { List } from "../models/list";

@Injectable({
    providedIn: 'root'
})
export class ListService {
    private apiURL = 'http://localhost:3000/api/lists';
    private httpClient = inject(HttpClient);

    lists = signal<List[]>([]);
    readonly lists$ = this.lists.asReadonly();

    addList(list: List): Observable<List> {
        const url = this.apiURL;
        return this.httpClient.post<List>(url, list).pipe(
            tap(() => this.getLists().subscribe())
        );
    }

    deleteList(id: number): Observable<void> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.delete<void>(url).pipe(
            tap(() => this.getLists().subscribe())
        );
    }

    updateList(id: number, updatedList: List): Observable<List> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<List>(url, updatedList).pipe(
            tap(() => this.getLists().subscribe())
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