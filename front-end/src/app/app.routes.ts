import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Task } from './main/task/task';
import { Calendar } from './main/calendar/calendar';

export const routes: Routes = [
    {
        path: 'index',
        component: Main,
        children: [
            {
                path: 'task',
                component: Task
            },
            {
                path: 'calendar',
                component: Calendar
            },
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
