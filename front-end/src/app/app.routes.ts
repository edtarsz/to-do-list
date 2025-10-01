import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Task } from './main/task/task';
import { Calendar } from './main/calendar/calendar';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Auth } from './auth/auth';

export const routes: Routes = [
    {
        path: 'auth',
        component: Auth,
        children: [
            { path: 'login', component: Login },
            { path: 'register', component: Register }
        ]
    },
    {
        path: 'index',
        component: Main,
        children: [
            { path: 'task', component: Task },
            { path: 'calendar', component: Calendar },
            {
                path: '',
                redirectTo: 'task',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/index/task',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/index/task'
    }
];
