import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerGroupReportComponent } from './ledger-group-report.component';

describe('LedgerGroupReportComponent', () => {

  let component: LedgerGroupReportComponent;
  let fixture: ComponentFixture<LedgerGroupReportComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ LedgerGroupReportComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(LedgerGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
