import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return value from getTasks', () => {
    
    // Arrange
    const result = service.getTasks(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getTasks should do
  });
  it('should call createTask', () => {
        const mockTask: any = {};
    // Arrange
    const result = service.createTask(123, mockTask);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what createTask should do
  });
  it('should return value from getTaskById', () => {
    
    // Arrange
    const result = service.getTaskById(123, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getTaskById should do
  });
  it('should call updateTask', () => {
        const mockTask: any = {};
    // Arrange
    const result = service.updateTask(123, 123, mockTask);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what updateTask should do
  });
  it('should call deleteTask', () => {
    
    // Arrange
    const result = service.deleteTask(123, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what deleteTask should do
  });
  it('should call storeDeletedTask', () => {
        const mockTask: any = {};
    // Arrange
    const result = service.storeDeletedTask(mockTask, 123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what storeDeletedTask should do
  });
  it('should call undoDelete', () => {
    // Act
    const result = service.undoDelete();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what undoDelete should do
  });
  it('should call if', () => {
        const mockThis.deletedtask: any = {};
    // Arrange
    const result = service.if(mockThis.deletedtask);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should return value from getTaskDeletedObservable', () => {
    // Act
    const result = service.getTaskDeletedObservable();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what getTaskDeletedObservable should do
  });
});