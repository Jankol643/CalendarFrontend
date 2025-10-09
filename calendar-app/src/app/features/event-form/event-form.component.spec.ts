import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../event.service';
import { CalendarService } from '../../services/calendar.service';
import { TimezoneService } from '../../services/timezone.service';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let mockEventService: jasmine.SpyObj<any>;
  let mockCalendarService: jasmine.SpyObj<any>;
  let mockTimezoneService: jasmine.SpyObj<any>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EventFormComponent>>;

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', ['createEvent', 'notifyEventsChanged']);
    mockCalendarService = jasmine.createSpyObj('CalendarService', ['getCalendarsByUser']);
    mockTimezoneService = jasmine.createSpyObj('TimezoneService', ['getTimezones']);

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [EventFormComponent],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: CalendarService, useValue: mockCalendarService },
        { provide: TimezoneService, useValue: mockTimezoneService },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ensure initial change detection
  });

  it('should create and initialize form', () => {
    spyOn(component, 'loadCalendars').and.callThrough();
    spyOn(component, 'loadTimezones').and.callThrough();

    component.ngOnInit();

    expect(component.eventForm).toBeDefined();
    expect(component.eventForm.get('title')).toBeTruthy();
    expect(component.loadCalendars).toHaveBeenCalled();
    expect(component.loadTimezones).toHaveBeenCalled();
  });

  describe('filterTimezones', () => {
    beforeEach(() => {
      component.timezones = [
        { name: 'UTC', utcOffset: '+00:00' },
        { name: 'EST', utcOffset: '-05:00' },
        { name: 'PST', utcOffset: '-08:00' }
      ];
    });

    it('should filter timezones by name', () => {
      const result = component._filterTimezones('UTC');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('UTC');
    });

    it('should filter timezones by offset', () => {
      const result = component._filterTimezones('-05');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('EST');
    });
  });

  describe('addEvent', () => {
    beforeEach(() => {
      // Set form valid
      component.eventForm.setValue({
        calendar: 1,
        title: 'Test Event',
        description: 'Desc',
        startDate: new Date('2023-10-01'),
        startTime: '10:00',
        endDate: new Date('2023-10-01'),
        endTime: '11:00',
        timezone: 'UTC',
        allDay: false,
        location: 'Test Location'
      });

      // Mock dateTimeService
      // Assuming dateTimeService is a public property or accessible
      if (component['dateTimeService']) {
        spyOn(component['dateTimeService'], 'parseDateTime').and.callFake((date, time) => `${date.toISOString()} ${time}`);
      }
    });

    it('should call createEvent and close dialog on success', fakeAsync(() => {
      const mockCreatedEvent = { id: 123 };
      mockEventService.createEvent.and.returnValue(of(mockCreatedEvent));

      spyOn(component, 'onNoClick');

      component.addEvent();
      tick(); // wait for async

      expect(component['loading']).toBeFalse(); // after complete
      expect(mockEventService.createEvent).toHaveBeenCalled();
      expect(component.onNoClick).toHaveBeenCalled();
      expect(mockEventService.notifyEventsChanged).toHaveBeenCalledWith([1]);
    }));

    it('should handle error during creation', fakeAsync(() => {
      mockEventService.createEvent.and.returnValue(throwError('error'));
      spyOn(console, 'error');

      component.addEvent();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating event:', 'error');
      expect(component['loading']).toBeFalse();
    }));

    it('should not submit if form is invalid', () => {
      spyOn(console, 'log');
      // Make the form invalid by resetting or not setting required fields
      // For example, clear title
      const form = component.eventForm;
      form.get('title')?.setValue('');
      form.get('title')?.markAsTouched();
      // Or set errors directly
      form.setErrors({ invalid: true });

      component.addEvent();

      expect(console.log).toHaveBeenCalledWith('Form invalid');
    });
  });
});