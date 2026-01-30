import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', //singleton
})
export class AuthService {
  private isAuthenticated = false;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin'){
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  //logout
  logout(): void{
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean{
    return this.isAuthenticated;
  }
}
