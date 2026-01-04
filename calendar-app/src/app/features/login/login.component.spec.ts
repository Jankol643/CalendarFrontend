import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call togglePasswordVisibility', () => {
        const mockEvent: any = {};
    // Arrange
    const result = component.togglePasswordVisibility(mockEvent);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what togglePasswordVisibility should do
  });
  it('should call onSubmit', () => {
    // Act
    const result = component.onSubmit();
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what onSubmit should do
  });
  it('should call if', () => {
        const mockThis.loginform.invalid: any = {};
    // Arrange
    const result = component.if(mockThis.loginform.invalid);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
  it('should call if', () => {
        const mockErr.status === 401: any = {};
    // Arrange
    const result = component.if(mockErr.status === 401);
    
    // Assert
    expect(result).toBeDefined();
    // Add specific assertions here based on what if should do
  });
});