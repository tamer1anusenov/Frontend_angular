import { Routes } from '@angular/router';
import {authGuard} from './auth/guards/auth-guard'

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadChildren: () => 
            import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: 'users',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./users/users.routes').then(m => m.USER_ROUTES),
    },
];
