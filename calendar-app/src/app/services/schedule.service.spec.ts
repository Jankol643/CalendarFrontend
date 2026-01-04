import { TestBed } from '@angular/core/testing';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call startScheduling', () => {
    // Act
    const result = service.startScheduling();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what startScheduling should do
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