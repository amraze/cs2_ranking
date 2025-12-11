import { Routes } from '@angular/router';
import { Authentication } from './features/authentication/authentication';
import { Dashboard } from './features/dashboard/dashboard';
import { Settings } from './features/settings/settings';
import { Stats } from './features/stats/stats';
import { History } from './features/history/history';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: Authentication },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'history', component: History, canActivate: [AuthGuard] },
    { path: 'stats', component: Stats, canActivate: [AuthGuard] },
    { path: 'settings', component: Settings, canActivate: [AuthGuard] },
];
