import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialBalanceReportComponent } from './trial-balance-report.component';

describe('TrialBalanceReportComponent', () => {
  let component: TrialBalanceReportComponent;
  let fixture: ComponentFixture<TrialBalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialBalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
