import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
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
  it('should call toggleCalendars', () => {
    // Act
    const result = component.toggleCalendars();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleCalendars should do
  });
  it('should call toggleCalendarVisibility', () => {
    
    // Arrange
    const result = component.toggleCalendarVisibility('testcalendar');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleCalendarVisibility should do
  });
  it('should call emitVisibleCalendars', () => {
    // Act
    const result = component.emitVisibleCalendars();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what emitVisibleCalendars should do
  });
  it('should call openEventForm', () => {
    // Act
    const result = component.openEventForm();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what openEventForm should do
  });
  it('should call open', () => {
        const mockEventformcomponent: any = {};
    const mock{
}
public importfromcsv(: any = {};
    // Arrange
    const result = component.open(mockEventformcomponent, mock{
}
public importfromcsv();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what open should do
  });
  it('should call toggleSidebar', () => {
    // Act
    const result = component.toggleSidebar();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleSidebar should do
  });
});