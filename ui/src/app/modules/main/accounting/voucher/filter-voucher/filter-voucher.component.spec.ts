import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVoucherComponent } from './filter-voucher.component';

describe('FilterVoucherComponent', () => {

  let component: FilterVoucherComponent;
  let fixture: ComponentFixture<FilterVoucherComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterVoucherComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
