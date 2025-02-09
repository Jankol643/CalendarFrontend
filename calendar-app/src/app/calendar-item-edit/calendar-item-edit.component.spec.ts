import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarItemEditComponent } from './calendar-item-edit.component';

describe('CalendarItemEditComponent', () => {
  let component: CalendarItemEditComponent;
  let fixture: ComponentFixture<CalendarItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarItemEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
