import { Component, OnInit, computed, signal } from '@angular/core'; // Добавили computed и signal
import { UsersService } from '../../services/users';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersListComponent implements OnInit {
  // Форма добавления
  newUserName = '';
  newUserUsername = '';
  newUserEmail = '';
  newUserCity = '';
  newUserCompany = '';
  showAddForm = false;
  
  // Удаление
  showDeleteConfirm = false;
  userToDelete: number | null = null;

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  searchControl = new FormControl('');
  
  // 1. Создаем сигнал для поискового запроса
  private searchQuery = signal('');

  // 2. Computed — это "живое" состояние. Оно само пересчитается, 
  // когда изменится либо список в сервисе, либо searchQuery.
  readonly filteredUsers = computed(() => {
    const users = this.userService.users();
    const search = this.searchQuery().toLowerCase().trim();

    if (!search) return users;

    return users.filter(user =>
      user.name.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search)
    );
  });

  constructor(
    public userService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {
    // 3. Больше никакой синхронизации через effect()! 
    // filteredUsers теперь сам знает, что делать.
  }

  ngOnInit(): void {
    this.userService.loadUsers();
    
    // 4. Просто связываем FormControl с нашим сигналом searchQuery
    this.searchControl.valueChanges
      .subscribe(value => this.searchQuery.set(value ?? ''));
  }

  // --- МЕТОДЫ ДЕЙСТВИЙ ---

  addUser(): void {
    const user: User = {
      id: Date.now(),
      name: this.newUserName,
      username: this.newUserUsername,
      email: this.newUserEmail,
    };

    if (this.newUserCity) {
      user.address = { city: this.newUserCity } as any;
    }
    if (this.newUserCompany) {
      user.company = { name: this.newUserCompany } as any;
    }

    this.userService.addUser(user);

    // Сброс формы
    this.newUserName = '';
    this.newUserUsername = '';
    this.newUserEmail = '';
    this.newUserCity = '';
    this.newUserCompany = '';
    this.showAddForm = false;
  }

  // Остальные методы без изменений
  toggleAddForm(): void { this.showAddForm = !this.showAddForm; }
  trackById(index: number, user: User): number { return user.id; }
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
  openDeleteConfirm(id: number): void { this.userToDelete = id; this.showDeleteConfirm = true; }
  closeDeleteConfirm(): void { this.showDeleteConfirm = false; this.userToDelete = null; }
  confirmDelete(): void {
    if (this.userToDelete !== null) {
      this.userService.deleteUser(this.userToDelete);
      this.closeDeleteConfirm();
    }
  }
}