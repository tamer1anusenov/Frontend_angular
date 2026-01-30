import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
];