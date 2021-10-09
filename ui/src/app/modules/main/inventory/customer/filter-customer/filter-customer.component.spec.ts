import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCustomerComponent } from './filter-customer.component';

describe('FilterCustomerComponent', () => {

  let component: FilterCustomerComponent;
  let fixture: ComponentFixture<FilterCustomerComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterCustomerComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
