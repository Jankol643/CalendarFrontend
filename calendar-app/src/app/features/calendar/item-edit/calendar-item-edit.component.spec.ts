import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarItemEditComponent } from './calendar-item-edit.component';

describe('CalendarItemEditComponent', () => {
  let component: CalendarItemEditComponent;
  let fixture: ComponentFixture<CalendarItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarItemEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalendarItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call if', () => {
        const mock!id && cid: any = {};
    // Arrange
    const result = component.if(mock!id && cid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call saveEvent', () => {
    // Act
    const result = component.saveEvent();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what saveEvent should do
  });
  it('should call if', () => {
        const mockThis.event: any = {};
    // Arrange
    const result = component.if(mockThis.event);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call convertToUTC', () => {
    
    // Arrange
    const result = component.convertToUTC('testlocalDateTime');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what convertToUTC should do
  });
  it('should check condition with cancelEdit', () => {
    // Act
    const result = component.cancelEdit();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what cancelEdit should do
  });
  it('should call formatDateForInput', () => {
        const mockDate: any = {};
    // Arrange
    const result = component.formatDateForInput(mockDate);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what formatDateForInput should do
  });
});