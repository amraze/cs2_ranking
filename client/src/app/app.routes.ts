import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { History } from './components/history/history';
import { Stats } from './components/stats/stats';
import { Settings } from './components/settings/settings';
import { Authentication } from './components/authentication/authentication';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: Authentication },
    { path: 'dashboard', component: Dashboard },
    { path: 'history', component: History },
    { path: 'stats', component: Stats },
    { path: 'settings', component: Settings },
];
