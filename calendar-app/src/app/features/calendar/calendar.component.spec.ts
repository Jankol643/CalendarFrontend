import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call if', () => {
        const mockAction: any = {};
    // Arrange
    const result = component.if(mockAction);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call loadEvents', () => {
    
    // Arrange
    const result = component.loadEvents(123);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what loadEvents should do
  });
  it('should call if', () => {
        const mock!calendarids.length: any = {};
    // Arrange
    const result = component.if(mock!calendarids.length);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call handleEvent', () => {
        const mockEvent: any = {};
    // Arrange
    const result = component.handleEvent('testaction', mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what handleEvent should do
  });
  it('should call if', () => {
        const mockAction === 'clicked': any = {};
    // Arrange
    const result = component.if(mockAction === 'clicked');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call onEditEvent', () => {
        const mockEvent: any = {};
    // Arrange
    const result = component.onEditEvent(mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what onEditEvent should do
  });
  it('should call handleNavigation', () => {
    
    // Arrange
    const result = component.handleNavigation('testaction');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what handleNavigation should do
  });
  it('should call switch', () => {
        const mockAction: any = {};
    // Arrange
    const result = component.switch(mockAction);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what switch should do
  });
});