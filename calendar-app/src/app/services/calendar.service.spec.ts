import { TestBed } from '@angular/core/testing';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return value from getCalendarsByUser', () => {
    // Act
    const result = service.getCalendarsByUser();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getCalendarsByUser should do
  });
  it('should call createCalendar', () => {
        const mockCalendar: any = {};
    // Arrange
    const result = service.createCalendar(mockCalendar);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what createCalendar should do
  });
  it('should return value from getCalendarById', () => {
    
    // Arrange
    const result = service.getCalendarById(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getCalendarById should do
  });
  it('should call updateCalendar', () => {
        const mockCalendar: any = {};
    // Arrange
    const result = service.updateCalendar(123, mockCalendar);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what updateCalendar should do
  });
  it('should call deleteCalendar', () => {
    
    // Arrange
    const result = service.deleteCalendar(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what deleteCalendar should do
  });
  it('should call handleError', () => {
        const mockError: any = {};
    // Arrange
    const result = service.handleError(mockError);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what handleError should do
  });
  it('should call if', () => {
        const mockError.error instanceof errorevent: any = {};
    // Arrange
    const result = service.if(mockError.error instanceof errorevent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
});