import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './auth/auth.guard';
import { Calendar } from './main/calendar/calendar';

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
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },

    {
        path: 'index',
        loadComponent: () => import('./main/main').then(m => m.Main),
        canActivate: [authGuard],
        children: [
            {
                path: 'tasks',
                loadComponent: () => import('./main/task/task').then(m => m.TaskComponent)
            },
            {
                path: 'calendar',
                component: Calendar
            },
            {
                path: 'update-profile',
                loadComponent: () => import('./main/update-profile/update-profile').then(m => m.UpdateProfile)
            },
            {
                path: '',
                redirectTo: 'tasks',
                pathMatch: 'full'
            },
        ]
    },

    {
        path: '**',
        redirectTo: 'index'
    }
];