import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return value from getEvents', () => {
    
    // Arrange
    const result = service.getEvents(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getEvents should do
  });
  it('should return value from getEventById', () => {
    
    // Arrange
    const result = service.getEventById(123, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getEventById should do
  });
  it('should call notifyEventsChanged', () => {
    
    // Arrange
    const result = service.notifyEventsChanged(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what notifyEventsChanged should do
  });
  it('should call createEvent', () => {
        const mockEvent: any = {};
    // Arrange
    const result = service.createEvent(mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what createEvent should do
  });
  it('should call updateEvent', () => {
        const mockEvent: any = {};
    // Arrange
    const result = service.updateEvent(mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what updateEvent should do
  });
  it('should call deleteEvent', () => {
    
    // Arrange
    const result = service.deleteEvent(123, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what deleteEvent should do
  });
  it('should call storeDeletedEvent', () => {
        const mockEvent: any = {};
    // Arrange
    const result = service.storeDeletedEvent(mockEvent, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what storeDeletedEvent should do
  });
  it('should call undoDelete', () => {
    // Act
    const result = service.undoDelete();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what undoDelete should do
  });
  it('should call if', () => {
        const mockThis.deletedevent: any = {};
    // Arrange
    const result = service.if(mockThis.deletedevent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should return value from getEventDeletedObservable', () => {
    // Act
    const result = service.getEventDeletedObservable();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getEventDeletedObservable should do
  });
});