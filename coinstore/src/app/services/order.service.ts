import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class orderService {
  private apiUrl = 'http://82.29.164.124:3000/api/orders'; // API endpoint for orders

  constructor(private http: HttpClient) {}

  createOrder(orderData: any) {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('authToken');

    // Check if the token exists
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    // Set the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    // Make the POST request with the headers
    return this.http.post(this.apiUrl, orderData, { headers });
  }
}
