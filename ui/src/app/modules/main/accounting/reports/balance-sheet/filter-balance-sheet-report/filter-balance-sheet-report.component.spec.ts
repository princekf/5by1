import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBalanceSheetReportComponent } from './filter-balance-sheet-report.component';

describe('FilterBalanceSheetReportComponent', () => {
  let component: FilterBalanceSheetReportComponent;
  let fixture: ComponentFixture<FilterBalanceSheetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterBalanceSheetReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBalanceSheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
