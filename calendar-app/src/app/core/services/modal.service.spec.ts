import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call showItemDetail', () => {
        const mockEvent: any = {};
    // Arrange
    const result = service.showItemDetail(mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what showItemDetail should do
  });
});