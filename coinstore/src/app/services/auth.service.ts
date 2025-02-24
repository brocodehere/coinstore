import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { of,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkAuthState();
  }

  // 🔹 Check and update authentication state
  private checkAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.isAuthenticated.next(!!token);
    }
  }
  

  // 🔹 Observable for authentication status
  get authStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  // 🔹 Check if user is logged in
  get isLoggedIn(): boolean {
    
    return this.isAuthenticated.value || !!localStorage.getItem('authToken');    
  }

  // 🔹 Register a new user
  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // 🔹 Login method (returns Observable so the component handles it)
  login(credentials: { email: string; password: string }) {
    this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).subscribe({
      next: (response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
        }
        this.isAuthenticated.next(true); // ✅ Update auth status
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }
  

  // 🔹 Logout method
  logout(): Observable<void> {
    try {
      // Check if the code is running in the browser
      if (isPlatformBrowser(this.platformId)) {
        // Remove the auth token from local storage
        localStorage.removeItem('authToken');
        
        // Optionally, clear other user-related data
        localStorage.removeItem('userData');
      }
  
      // Update authentication status
      this.isAuthenticated.next(false);
  
      // Navigate to the login page
      this.router.navigate(['/login']);
  
      // Return an observable to indicate success
      return of(undefined);
    } catch (error) {
      console.error('Error during logout:', error);
      // Return an observable with an error
      return throwError(() => new Error('Logout failed'));
    }
  }
}
