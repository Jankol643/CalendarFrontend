import { TestBed } from '@angular/core/testing';

import { CalendarNavigationService } from './calendar-navigation.service';

describe('CalendarNavigationService', () => {
  let service: CalendarNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
