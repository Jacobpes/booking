import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  let httpTestingController: HttpTestingController;
  const testUrl = 'http://localhost:8000/api/bookings';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAvailableSlots() should return expected data', () => {
    const dummySlots = [{ id: 1, start: '10:00', end: '11:00' }];
    
    service.getAvailableSlots().subscribe(slots => {
      expect(slots.length).toBe(1);
      expect(slots).toEqual(dummySlots);
    });

    const req = httpTestingController.expectOne(`${testUrl}/available-slots`);
    expect(req.request.method).toEqual('GET');
    req.flush(dummySlots);
  });

  it('submitBooking() should post and return the booking data', () => {
    const dummyBooking = { name: 'John Doe', email: 'john@example.com', timeLength: '1h', phoneNumber: '1234567890', slotId: 1 };
    
    service.submitBooking(dummyBooking).subscribe(data => {
      expect(data).toEqual(dummyBooking);
    });

    const req = httpTestingController.expectOne(`${testUrl}/submit-booking`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dummyBooking);
    req.flush(dummyBooking);
  });
});
