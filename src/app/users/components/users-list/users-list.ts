import { Component, OnInit, effect } from '@angular/core';
import { UsersService } from '../../services/users';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-users-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersListComponent implements OnInit {
  newUserName = '';
  newUserEmail = '';

  searchControl = new FormControl('');
  filteredUsers: User[] = [];

  constructor(public userService: UsersService) {
    // Автоматически обновляем filteredUsers при изменении users
    effect(() => {
      const users = this.userService.users();
      this.applyFilter(this.searchControl.value ?? '');
    });
  }

  ngOnInit(): void {
    // Загружаем данные из сервиса
    this.userService.loadUsers();
    
    // Подписываемся на изменения в поиске
    this.searchControl.valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged()      
    )
    .subscribe((value) =>{
      this.applyFilter(value ?? '');
    });
  }

  applyFilter(value: string): void{
    const search = value.toLowerCase();
    const users = this.userService.users();

    this.filteredUsers = users.filter( user =>
      user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
    );
  }

  addUser(): void{
    const user: User = {
      id: Date.now(),
      name: this.newUserName,
      username: this.newUserName,
      email: this.newUserEmail,
    };

    this.userService.addUser(user);
    this.applyFilter(this.searchControl.value ?? '');

    this.newUserName = '';
    this.newUserEmail = '';
  }

  trackById(index: number, user: User): number {
    return user.id;
  }
}
