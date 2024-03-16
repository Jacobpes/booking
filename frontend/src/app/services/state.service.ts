import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor() { }

  selectedDuration = 30;
  selectedStartTime: string | null = null;
  selectedDay: Date | null = null;
  
  setSelectedDuration(duration: number): void {
    this.selectedDuration = duration;
  }
  setSelectedStartTime(startTime: string): void {
    this.selectedStartTime = startTime;
  }
  setSelectedDay(day: Date): void {
    this.selectedDay = day;
  }
}
