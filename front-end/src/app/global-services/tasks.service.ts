import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { Task } from "../models/task";
import { environment } from "../../enviroments/environment";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiURL = `${environment.BACK_END_URL}/api/tasks`;
    private httpClient = inject(HttpClient);

    tasks = signal<Task[]>([]);
    readonly tasks$ = this.tasks.asReadonly();

    addTask(task: Task): Observable<Task> {
        const tempId = Date.now();
        const tempTask: Task = { ...task, id: tempId };

        this.tasks.update(currentTasks => [...currentTasks, tempTask]);

        return this.httpClient.post<Task>(this.apiURL, task).pipe(
            tap(confirmedTask => {
                this.tasks.update(currentTasks =>
                    currentTasks.map(t =>
                        t.id === tempId ? confirmedTask : t
                    )
                );
            }),
            catchError(error => {
                this.tasks.update(currentTasks =>
                    currentTasks.filter(t => t.id !== tempId)
                );
                return throwError(() => error);
            })
        );
    }

    deleteTask(id: number): Observable<void> {
        const previousTasks = this.tasks();

        this.tasks.update(currentTasks => currentTasks.filter(t => t.id !== id));

        const url = `${this.apiURL}/${id}`;
        return this.httpClient.delete<void>(url).pipe(
            catchError(error => {
                this.tasks.set(previousTasks);
                return throwError(() => error);
            })
        );
    }

    // The payload is a partial Task object, meaning it can contain one or more properties to be updated
    updateTask(id: number, payload: Partial<Task>): Observable<Task> {
        const previousTasks = this.tasks();

        this.tasks.update(currentTasks =>
            currentTasks.map(t =>
                // If the task ID matches, merge the existing task with the payload to create an updated task
                t.id === id ? { ...t, ...payload } : t
            )
        );

        const url = `${this.apiURL}/${id}`;
        return this.httpClient.patch<Task>(url, payload).pipe(
            tap(updatedTask => {
                this.tasks.update(currentTasks =>
                    currentTasks.map(t =>
                        t.id === id ? updatedTask : t
                    )
                );
            }),
            catchError(error => {
                this.tasks.set(previousTasks);
                return throwError(() => error);
            })
        );
    }

    getTasks(): Observable<Task[]> {
        return this.httpClient.get<Task[]>(this.apiURL).pipe(
            tap(res => this.tasks.set(res))
        );
    }

    getTaskById(id: number): Observable<Task> {
        const url = `${this.apiURL}/${id}`;
        return this.httpClient.get<Task>(url);
    }

    clear() {
        this.tasks.set([]);
    }
}
