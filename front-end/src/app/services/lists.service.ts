import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/internal/operators/tap";
import { Observable } from "rxjs";
import { List } from "../models/list";
import { lists } from "../../assets/mock/lists";

@Injectable({
    providedIn: 'root'
})
export class ListService {
    private apiURL = 'http://localhost:3000/api/v1/lists';
    private httpClient = inject(HttpClient);

    lists = signal<List[]>(lists);
    readonly lists$ = this.lists.asReadonly();

    agregarList(list: List): Observable<List> {
        const url = this.apiURL;
        return this.httpClient.post<List>(url, list).pipe(
            tap(() => this.obtenerLists().subscribe())
        );
    }

    eliminarList(id: number): Observable<void> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.delete<void>(url).pipe(
            tap(() => this.obtenerLists().subscribe())
        );
    }

    actualizarList(id: number, listEditada: List): Observable<List> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<List>(url, listEditada).pipe(
            tap(() => this.obtenerLists().subscribe())
        );
    }

    obtenerLists(): Observable<List[]> {
        const url = this.apiURL;
        return this.httpClient.get<List[]>(url).pipe(tap(res => this.lists.set(res)));
    }

    obtenerListPorId(id: number): Observable<List> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.get<List>(url).pipe();
    }

    asignarTaskACarrera(taskId: number, carreraId: number): Observable<List> {
        const url = `${this.apiURL}/${taskId}`;

        return this.httpClient.patch<List>(url, { carreraId }).pipe(
            tap(() => this.obtenerLists().subscribe())
        );
    }
}