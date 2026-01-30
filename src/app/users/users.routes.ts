import { Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component:UsersListComponent,
    },

];