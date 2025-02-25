import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderhistoryService {
  private apiUrl = 'http://82.29.164.124:3000/api/orderhistory'; // API endpoint for orders

  constructor(private http: HttpClient) {}

  // Fetch orders for the logged-in user
  getOrders(): Observable<any> {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('authToken');

    // Check if the token exists
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Make the GET request with the headers
    return this.http.get(this.apiUrl, { headers });
  }
}
