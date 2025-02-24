import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Make sure this import exists
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient, // <-- Add this line
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUserData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    return this.http.get(`${environment.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}