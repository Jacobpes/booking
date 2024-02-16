import { Component } from '@angular/core';
import { BookingService } from '../../app/services/booking.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  selectedTimeDate: Date = new Date();
  selectedDuration: number = 30;
  selectedStartTime: string | null = null;
  booking = {
    name: '',
    email: '',
    phoneNumber: '',
  };
  bookingForm: any;

  constructor(private bookingService: BookingService) {}

  submitBooking() {
    if (this.bookingForm.invalid) {
      // Form validation failed, do not submit
      return;
    }

    // Call the booking service to submit the booking
    this.bookingService.submitBooking(this.booking).subscribe(
      () => {
        // Booking successfully submitted
        alert('Booking submitted successfully!');
        // Reset the form
        this.resetForm();
      },
      (error) => {
        // Error occurred while submitting booking
        console.error('Error submitting booking:', error);
        alert('An error occurred while submitting your booking. Please try again later.');
      }
    );
  }

  resetForm() {
    this.booking = {
      name: '',
      email: '',
      phoneNumber: '',
    };
  }
  endingTime(): Date {
    const endingTime = this.selectedTimeDate;

    endingTime.setMinutes(endingTime.getMinutes() + this.selectedDuration);
    return endingTime;
  }
}
