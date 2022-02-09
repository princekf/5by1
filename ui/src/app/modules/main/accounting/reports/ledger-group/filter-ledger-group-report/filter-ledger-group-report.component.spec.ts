import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLedgerGroupReportComponent } from './filter-ledger-group-report.component';

describe('FilterLedgerGroupReportComponent', () => {
  let component: FilterLedgerGroupReportComponent;
  let fixture: ComponentFixture<FilterLedgerGroupReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterLedgerGroupReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLedgerGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
