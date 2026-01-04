import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CSVInputComponent } from './csvinput.component';

describe('CSVInputComponent', () => {
  let component: CSVInputComponent;
  let fixture: ComponentFixture<CSVInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSVInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CSVInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call uploadProgress', () => {
    // Act
    const result = component.uploadProgress();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what uploadProgress should do
  });
  it('should call onFileSelected', () => {
        const mockEvent: any = {};
    const mockUploadtype: any = {};
    // Arrange
    const result = component.onFileSelected(mockEvent, mockUploadtype);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what onFileSelected should do
  });
  it('should call if', () => {
        const mockFile: any = {};
    // Arrange
    const result = component.if(mockFile);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call uploadText', () => {
        const mockUploadtype: any = {};
    // Arrange
    const result = component.uploadText(mockUploadtype);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what uploadText should do
  });
  it('should check condition with cancelUpload', () => {
    
    // Arrange
    const result = component.cancelUpload('testid');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what cancelUpload should do
  });
  it('should call if', () => {
        const mockThis.currentuploadid === id: any = {};
    // Arrange
    const result = component.if(mockThis.currentuploadid === id);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call uploadItemProgressSubscription', () => {
        const mockUploaditem: any = {};
    // Arrange
    const result = component.uploadItemProgressSubscription(mockUploaditem, 'testid');
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what uploadItemProgressSubscription should do
  });
  it('should call if', () => {
        const mockProgress >= 100: any = {};
    // Arrange
    const result = component.if(mockProgress >= 100);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call if', () => {
        const mockThis.currentuploadid === id: any = {};
    // Arrange
    const result = component.if(mockThis.currentuploadid === id);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
});