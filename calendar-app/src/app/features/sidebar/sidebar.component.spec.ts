import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../event.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockCalendarService: jasmine.SpyObj<CalendarService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockCalendarService = jasmine.createSpyObj('CalendarService', ['getCalendarsByUser']);
    mockEventService = jasmine.createSpyObj('EventService', ['notifyEventsChanged']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        { provide: CalendarService, useValue: mockCalendarService },
        { provide: EventService, useValue: mockEventService },
        { provide: MatDialog, useValue: mockDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load calendars and set them', () => {
      const mockResponse = { data: [{ id: 1, title: 'Cal 1', visible: true }] };
      mockCalendarService.getCalendarsByUser.and.returnValue(of(mockResponse));

      component.ngOnInit();

      expect(component.calendars.length).toBe(1);
      expect(component.calendars[0].title).toBe('Cal 1');
    });

    it('should handle error when loading calendars', () => {
      mockCalendarService.getCalendarsByUser.and.returnValue(throwError('error'));

      spyOn(console, 'error');
      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error fetching calendars:', 'error');
    });
  });

  describe('toggleCalendars', () => {
    it('should toggle showCalendars', () => {
      const initial = component.showCalendars;
      component.toggleCalendars();
      expect(component.showCalendars).toBe(!initial);
    });
  });

  describe('toggleCalendarVisibility', () => {
    it('should toggle the calendar visibility and notify', () => {
      const calendar = { id: 1, title: 'Cal', visible: true };
      component.calendars = [calendar];

      component.toggleCalendarVisibility(calendar);
      expect(calendar.visible).toBe(false);
      expect(mockEventService.notifyEventsChanged).toHaveBeenCalledWith([1]);
    });
  });

  describe('openEventForm', () => {
    it('should open the dialog', () => {
      component.openEventForm();
      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({ width: '400px' }));
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      // Spy on the unsubscribe method of the subscriptions property
      const subscriptionsSpy = spyOn(component['subscriptions'], 'unsubscribe').and.callThrough();

      component.ngOnDestroy();

      expect(subscriptionsSpy).toHaveBeenCalled();
    });
  });
});