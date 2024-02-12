import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  daysInWeek: { date: Date, dayOfWeek: string }[] = [];
  timeSlots: string[] = [];
  selectedDuration = 30;

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.calculateDaysInWeek();
    this.generateTimeSlots();
  }

  calculateDaysInWeek(): void {
    this.daysInWeek = [];
  
    const currentDayOfWeek = this.currentDate.getDay();
    const mondayDate = new Date(this.currentDate);
    mondayDate.setDate(mondayDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + i);
      this.daysInWeek.push({ date: date, dayOfWeek: this.getDayOfWeekString(date.getDay()) });
    }
  }

  getDayOfWeekString(dayIndex: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  }

  generateTimeSlots(): void {
    this.timeSlots = []; // Clear existing time slots
    const startTime = new Date();
    startTime.setHours(9, 0, 0); // Start from 9:00 AM

    const endTime = new Date();
    endTime.setHours(21, 0, 0); // End at 21:00 (9:00 PM)

    while(startTime < endTime) {
      const formattedTime = this.datePipe.transform(startTime, 'HH:mm')!; // Use 24-hour format
      this.timeSlots.push(formattedTime);
      startTime.setMinutes(startTime.getMinutes() + 15); // Increment by 15 minutes
    }
  }

  goToPreviousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.calculateDaysInWeek();
  }

  goToNextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.calculateDaysInWeek();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMMM dd, yyyy')!;
  }
}
