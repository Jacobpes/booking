// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8000/api/bookings'; // Update with your actual backend URL

  constructor(private http: HttpClient) { }

  getAvailableSlots(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-slots`);
  }

  submitBooking(bookingDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-booking`, bookingDetails);
  }
}
