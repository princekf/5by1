import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBankComponent } from './filter-bank.component';

describe('FilterBankComponent', () => {

  let component: FilterBankComponent;
  let fixture: ComponentFixture<FilterBankComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterBankComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
