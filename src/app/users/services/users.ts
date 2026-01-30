import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';
  private readonly STORAGE_KEY = 'local_users';
  private localUsers: User[] =[];


  constructor(private http: HttpClient) {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.localUsers = stored ? JSON.parse(stored) : [];
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.API_URL).pipe(
      map(apiUsers => [...apiUsers, ...this.localUsers])
    );
  }

  addUser(user: User): void{
    this.localUsers.push(user);
    localStorage.setItem(
      this.STORAGE_KEY, 
      JSON.stringify(this.localUsers)
    );
  }
  
}