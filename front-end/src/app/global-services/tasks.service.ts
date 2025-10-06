import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/internal/operators/tap";
import { Observable } from "rxjs";
import { Task } from "../models/task";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiURL = 'http://localhost:3000/api/tasks';
    private httpClient = inject(HttpClient);

    tasks = signal<Task[]>([]);
    readonly tasks$ = this.tasks.asReadonly();

    addTask(task: Task): Observable<Task> {
        const url = this.apiURL;
        return this.httpClient.post<Task>(url, task).pipe(
            tap(() => this.getTasks().subscribe())
        );
    }

    deleteTask(id: number): Observable<void> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.delete<void>(url).pipe(
            tap(() => this.getTasks().subscribe())
        );
    }

    updateTask(id: number, updatedTask: Task): Observable<Task> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<Task>(url, updatedTask).pipe(
            tap(() => this.getTasks().subscribe())
        );
    }

    getTasks(): Observable<Task[]> {
        const url = this.apiURL;
        return this.httpClient.get<Task[]>(url).pipe(tap(res => this.tasks.set(res)));
    }

    getTaskById(id: number): Observable<Task> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.get<Task>(url).pipe();
    }

    clear() {
        this.tasks.set([]);
    }
}