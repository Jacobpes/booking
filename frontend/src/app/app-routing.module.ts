import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component'; // Adjust the import path based on your project structure
import { BookingFormComponent } from 'src/components/booking-form/booking-form.component';
import { ConfirmationComponent } from 'src/components/confirmation/confirmation.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'booking-form', component: BookingFormComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '', redirectTo: '/calendar', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
