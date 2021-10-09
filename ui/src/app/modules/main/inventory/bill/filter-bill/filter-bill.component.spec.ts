import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBillComponent } from './filter-bill.component';

describe('FilterBillComponent', () => {

  let component: FilterBillComponent;
  let fixture: ComponentFixture<FilterBillComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterBillComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
