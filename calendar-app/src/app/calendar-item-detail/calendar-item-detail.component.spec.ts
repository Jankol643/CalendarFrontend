import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarItemDetailComponent } from './calendar-item-detail.component';

describe('CalendarItemDetailComponent', () => {
  let component: CalendarItemDetailComponent;
  let fixture: ComponentFixture<CalendarItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarItemDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalendarItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
