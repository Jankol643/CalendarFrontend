import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCalendars', () => {
    // Act
    const result = component.loadCalendars();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what loadCalendars should do
  });
  it('should call subscribe', () => {
        const mock{
}: any = {};
    const mock}
}
private loadtimezones(: any = {};
    // Arrange
    const result = component.subscribe(mock{
}, mock}
}
private loadtimezones();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what subscribe should do
  });
  it('should call onNoClick', () => {
    // Act
    const result = component.onNoClick();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what onNoClick should do
  });
  it('should call randomiseForm', () => {
    // Act
    const result = component.randomiseForm();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what randomiseForm should do
  });
  it('should call addEvent', () => {
    // Act
    const result = component.addEvent();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what addEvent should do
  });
  it('should call if', () => {
        const mockThis.eventform.invalid: any = {};
    // Arrange
    const result = component.if(mockThis.eventform.invalid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
});