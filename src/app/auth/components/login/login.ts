import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  login(): void{
    const success = this.authService.login(this.username, this.password);

    if(success){
      this.router.navigate(['/users']);
    } else{
      this.error = true;
    }
  }
}
