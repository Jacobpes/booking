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
    this.daysInWeek = []; // Clear the array before calculating new week days
  
    const currentDayOfWeek = this.currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const mondayDate = new Date(this.currentDate);
    mondayDate.setDate(mondayDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)); // Adjust for Sunday
  
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
    const startTime = new Date();
    startTime.setHours(9, 0, 0); // Start from 9:00 AM

    for (let i = 0; i < 6; i++) {
      const time = new Date(startTime.getTime() + i * 15 * 60 * 1000); // Increment by 15 minutes
      const formattedTime = this.datePipe.transform(time, 'shortTime')!;
      this.timeSlots.push(formattedTime);
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
