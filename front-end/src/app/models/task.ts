export interface Task {
    id?: number;
    name: string;
    description?: string;
    priority: Priority;

    startDate: string;
    dueDate?: string;

    startTime: string;
    dueTime?: string;

    completed?: boolean;
}

export enum Priority {
    LOW,
    MEDIUM,
    HIGH
}
