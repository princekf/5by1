import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLedgerComponent } from './filter-ledger.component';

describe('FilterLedgerComponent', () => {

  let component: FilterLedgerComponent;
  let fixture: ComponentFixture<FilterLedgerComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterLedgerComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
