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
});
