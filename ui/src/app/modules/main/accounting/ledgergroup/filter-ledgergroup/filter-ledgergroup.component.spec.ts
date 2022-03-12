import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLedgergroupComponent } from './filter-ledgergroup.component';

describe('FilterLedgergroupComponent', () => {

  let component: FilterLedgergroupComponent;
  let fixture: ComponentFixture<FilterLedgergroupComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterLedgergroupComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterLedgergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
