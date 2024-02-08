import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../app/services/booking.service';
import { BookingFormComponent } from './booking-form.component';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;

  beforeEach(async () => {
    const bookingServiceSpyObj = jasmine.createSpyObj('BookingService', ['submitBooking']);

    await TestBed.configureTestingModule({
      declarations: [BookingFormComponent],
      imports: [FormsModule],
      providers: [{ provide: BookingService, useValue: bookingServiceSpyObj }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    bookingServiceSpy = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
