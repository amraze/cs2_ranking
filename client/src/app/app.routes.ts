import { Routes } from '@angular/router';
import { Stats } from 'fs';
import { Authentication } from './features/authentication/authentication';
import { Dashboard } from './features/dashboard/dashboard';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: Authentication },
    { path: 'dashboard', component: Dashboard },
    { path: 'history', component: History },
    { path: 'stats', component: Stats },
    { path: 'settings', component: Settings },
];
