import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLedgerReportComponent } from './filter-ledger-report.component';

describe('FilterLedgerReportComponent', () => {
  let component: FilterLedgerReportComponent;
  let fixture: ComponentFixture<FilterLedgerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterLedgerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
