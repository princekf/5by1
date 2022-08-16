import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBookReportComponent } from './day-book-report.component';

describe('DayBookReportComponent', () => {
  let component: DayBookReportComponent;
  let fixture: ComponentFixture<DayBookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayBookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
