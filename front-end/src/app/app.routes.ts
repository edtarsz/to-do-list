import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth/auth').then(m => m.Auth),
        canActivate: [publicGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./auth/login/login').then(m => m.Login),
            },
            {
                path: 'register',
                loadComponent: () => import('./auth/register/register').then(m => m.Register),
            },
        ]
    },
    {
        path: 'index',
        loadComponent: () => import('./main/main').then(m => m.Main),
        canActivate: [authGuard],
        children: [
            { path: 'task', loadComponent: () => import('./main/task/task').then(m => m.Task) },
            { path: 'calendar', loadComponent: () => import('./main/calendar/calendar').then(m => m.Calendar) },
            {
                path: '',
                redirectTo: 'task',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
