import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call showNotification', () => {
        const mockOptions: any = {};
    // Arrange
    const result = service.showNotification(mockOptions);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what showNotification should do
  });
});