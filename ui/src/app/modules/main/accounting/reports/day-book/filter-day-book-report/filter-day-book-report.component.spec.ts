import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDayBookReportComponent } from './filter-day-book-report.component';

describe('FilterDayBookReportComponent', () => {
  let component: FilterDayBookReportComponent;
  let fixture: ComponentFixture<FilterDayBookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDayBookReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDayBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
