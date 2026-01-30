import { Component, OnInit } from '@angular/core';
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
  users: User[] = [];
  loading = true;
  error = false;
  newUserName = '';
  newUserEmail = '';

  searchControl = new FormControl('');
  filteredUsers: User[] = [];


  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
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

    this.filteredUsers = this.users.filter( user =>
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
    this.users.push(user);
    this.applyFilter(this.searchControl.value ?? '');

    this.newUserName = '';
    this.newUserEmail = '';
  }


}
