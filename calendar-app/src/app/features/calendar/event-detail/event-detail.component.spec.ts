import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTimezones', () => {
    // Act
    const result = component.loadTimezones();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what loadTimezones should do
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
  it('should call saveEvent', () => {
    // Act
    const result = component.saveEvent();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what saveEvent should do
  });
  it('should call subscribe', () => {
        const mock{
this.notificationservice.shownotification({
message: any = {};
    const mockDuration: any = {};
    const mock}
}
deleteevent(: any = {};
    // Arrange
    const result = component.subscribe(mock{
this.notificationservice.shownotification({
message, mockDuration, mock}
}
deleteevent();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what subscribe should do
  });
  it('should call if', () => {
        const mockThis.event?.id && this.event?.meta?.calendarid: any = {};
    // Arrange
    const result = component.if(mockThis.event?.id && this.event?.meta?.calendarid);
    
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
if (this.event?.meta?.calendarid: any = {};
    // Arrange
    const result = component.subscribe(mock{
if (this.event?.meta?.calendarid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what subscribe should do
  });
});