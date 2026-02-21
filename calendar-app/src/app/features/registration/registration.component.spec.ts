import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initRegForm', () => {
    // Act
    const result = component.initRegForm();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what initRegForm should do
  });
  it('should call passwordMatchValidator', () => {
        const mockForm: any = {};
    // Arrange
    const result = component.passwordMatchValidator(mockForm);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what passwordMatchValidator should do
  });
  it('should call toggleFieldTextType', () => {
    // Act
    const result = component.toggleFieldTextType();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleFieldTextType should do
  });
  it('should call toggleRepeatFieldTextType', () => {
    // Act
    const result = component.toggleRepeatFieldTextType();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what toggleRepeatFieldTextType should do
  });
  it('should call passwordFieldType', () => {
    // Act
    const result = component.passwordFieldType();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what passwordFieldType should do
  });
  it('should call repeatPasswordFieldType', () => {
    // Act
    const result = component.repeatPasswordFieldType();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what repeatPasswordFieldType should do
  });
  it('should call passwordIconClass', () => {
    // Act
    const result = component.passwordIconClass();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what passwordIconClass should do
  });
  it('should call repeatPasswordIconClass', () => {
    // Act
    const result = component.repeatPasswordIconClass();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what repeatPasswordIconClass should do
  });
  it('should call onSubmit', () => {
    // Act
    const result = component.onSubmit();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what onSubmit should do
  });
  it('should call if', () => {
        const mockThis.registrationform.invalid: any = {};
    // Arrange
    const result = component.if(mockThis.registrationform.invalid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
});