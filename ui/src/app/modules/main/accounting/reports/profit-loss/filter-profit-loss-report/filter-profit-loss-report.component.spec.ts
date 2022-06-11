import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProfitLossReportComponent } from './filter-profit-loss-report.component';

describe('FilterProfitLossReportComponent', () => {
  let component: FilterProfitLossReportComponent;
  let fixture: ComponentFixture<FilterProfitLossReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProfitLossReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProfitLossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
