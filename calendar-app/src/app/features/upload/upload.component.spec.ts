import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call triggerUploadText', () => {
        const mockType: any = {};
    // Arrange
    const result = component.triggerUploadText(mockType);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what triggerUploadText should do
  });
  it('should call startScheduling', () => {
    // Act
    const result = component.startScheduling();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what startScheduling should do
  });
});