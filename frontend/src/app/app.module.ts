import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from 'src/components/calendar/calendar.component';
import { ConfirmationComponent } from 'src/components/confirmation/confirmation.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ConfirmationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
