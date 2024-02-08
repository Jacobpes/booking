import { Component, Input } from '@angular/core';
import { BookingService } from '../../app/services/booking.service'; 

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  constructor(
    private bookingService: BookingService,
    ) { }
  booking: any;
  @Input() set details(details: any) {
    this.booking = details;
  }
  submitBooking() {
    this.bookingService.submitBooking(this.booking).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
