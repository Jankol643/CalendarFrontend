import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineNumberedTextareaComponent } from './line-numbered-textarea.component';

describe('LineNumberedTextareaComponent', () => {
  let component: LineNumberedTextareaComponent;
  let fixture: ComponentFixture<LineNumberedTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineNumberedTextareaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineNumberedTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
