import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeSlotComponent } from './day-time-slot.component';

describe('DayTimeSlotComponent', () => {
  let component: DayTimeSlotComponent;
  let fixture: ComponentFixture<DayTimeSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTimeSlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayTimeSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
