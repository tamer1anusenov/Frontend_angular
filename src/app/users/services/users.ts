import { Injectable, signal, effect} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';
import {User} from '../models/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';
  private readonly STORAGE_KEY = 'local_users';

  readonly users = signal<User[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<User[]>(this.API_URL)
      .pipe(finalize(() => this.loading.set(false))) //here logic of loader
      .subscribe({
        next: (apiUsers) => {
          const localUsers = this.getStoredUsers();
          this.users.set([...localUsers, ...apiUsers]);
        },
        error: (err) => {
          this.error.set('Не удалось загрузить пользователей');
          console.error('[UsersService] HTTP ERROR', err);
        }
      });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  addUser(newUser: User): void {
    this.users.update(allUsers => [newUser, ...allUsers]);
    this.saveToLocalStorage();
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToLocalStorage(): void {
    const localOnly = this.users().filter(u => u.id > 1000000000000);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(localOnly));
  }
}