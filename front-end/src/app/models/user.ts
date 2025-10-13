export interface User {
    id?: string;
    name: string;
    lastName: string;
    username: string;
    password?: string;
    role?: Role;
}

export enum Role {
    ADMIN,
    USER
}