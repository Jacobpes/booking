import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  daysInWeek: { date: Date, dayOfWeek: string, timeSlots: { time: string, isSelected: boolean }[] }[] = [];
  selectedDuration = 30;
  selectedStartTime: string | null = null;
  selectedDay: Date | null = null;

  constructor(
    private stateService: StateService,
    private datePipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.calculateDaysInWeek();
    this.generateTimeSlotsForAllDays();
  }

  calculateDaysInWeek(): void {
    this.daysInWeek = [];
  
    const currentDayOfWeek = this.currentDate.getDay();
    const mondayDate = new Date(this.currentDate);
    mondayDate.setDate(mondayDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + i);
      this.daysInWeek.push({ date: date, dayOfWeek: this.getDayOfWeekString(date.getDay()), timeSlots: this.generateTimeSlots(date) });
    }
  }

  generateTimeSlotsForAllDays(): void {
    this.daysInWeek.forEach(day => {
      day.timeSlots = this.generateTimeSlots(day.date);
    });
  }

  generateTimeSlots(date: Date): { time: string, isSelected: boolean }[] {
    let timeSlots: { time: string, isSelected: boolean }[] = [];
    const startTime = new Date(date.setHours(9, 0, 0));
    const endTime = new Date(date.setHours(21, 0, 0));

    while(startTime < endTime) {
      const formattedTime = this.datePipe.transform(startTime, 'HH:mm')!;
      timeSlots.push({ time: formattedTime, isSelected: false });
      startTime.setMinutes(startTime.getMinutes() + 15);
    }
    return timeSlots;
  }

  selectStartTime(day: Date, time: string): void {
    this.selectedDay = day;
    this.selectedStartTime = time;
    this.stateService.setSelectedStartTime(time);
    this.updateSelectedSlots();
    console.log(this.stateService.selectedStartTime, this.stateService.selectedDuration);
  }

  updateSelectedSlots(): void {
    if (!this.selectedStartTime || !this.selectedDay) return;

    const durationInMinutes = this.selectedDuration;
    let currentTime = new Date(this.selectedDay);
    currentTime.setHours(parseInt(this.selectedStartTime.split(':')[0]), parseInt(this.selectedStartTime.split(':')[1]), 0);

    this.daysInWeek.forEach(day => {
      if (day.date.toDateString() === this.selectedDay?.toDateString()) {
        day.timeSlots.forEach(slot => {
          const slotTime = new Date(day.date);
          slotTime.setHours(parseInt(slot.time.split(':')[0]), parseInt(slot.time.split(':')[1]), 0);

          slot.isSelected = slotTime >= currentTime && slotTime < new Date(currentTime.getTime() + durationInMinutes * 60000);
        });
      } else {
        day.timeSlots.forEach(slot => slot.isSelected = false); // Deselect slots for other days
      }
    });
  }

  getDayOfWeekString(dayIndex: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
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
  selectDuration(duration: number): void {
    this.selectedDuration = duration;
    this.stateService.setSelectedDuration(duration);
    this.updateSelectedSlots();
    console.log(this.stateService.selectedStartTime, this.stateService.selectedDuration);
  }
  isToday(date: Date): boolean {
    const today = new Date();
    console.log(date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear());
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}
