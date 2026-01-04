import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call editTask', () => {
    // Act
    const result = component.editTask();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what editTask should do
  });
  it('should call if', () => {
        const mockThis.task?.id: any = {};
    // Arrange
    const result = component.if(mockThis.task?.id);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call toggleEdit', () => {
    // Act
    const result = component.toggleEdit();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleEdit should do
  });
  it('should call if', () => {
        const mockThis.isediting: any = {};
    // Arrange
    const result = component.if(mockThis.isediting);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call saveTask', () => {
    // Act
    const result = component.saveTask();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what saveTask should do
  });
  it('should call deleteTask', () => {
    // Act
    const result = component.deleteTask();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what deleteTask should do
  });
  it('should call if', () => {
        const mockThis.task?.id && this.task?.calendarid: any = {};
    // Arrange
    const result = component.if(mockThis.task?.id && this.task?.calendarid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call undoDelete', () => {
    // Act
    const result = component.undoDelete();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what undoDelete should do
  });
  it('should call if', () => {
        const mockUndoobservable: any = {};
    // Arrange
    const result = component.if(mockUndoobservable);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call subscribe', () => {
        const mock{
if (this.task?.calendarid: any = {};
    // Arrange
    const result = component.subscribe(mock{
if (this.task?.calendarid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what subscribe should do
  });
});