import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[] = []; // Store registered users
  private currentUserSubject = new BehaviorSubject<string | null>(null); // Observable for current user
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // --- Signup ---
  signup(name: string, email: string, password: string): boolean {
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) return false; // email exists
    this.users.push({ name, email, password });
    this.currentUserSubject.next(name); // set current user
    return true;
  }

  // --- Login ---
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user.name); // set current user
      return true;
    }
    return false;
  }

  // --- Logout ---
  logout() {
    this.currentUserSubject.next(null);
  }

  // --- Get Current User ---
  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  // --- Check if logged in ---
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
