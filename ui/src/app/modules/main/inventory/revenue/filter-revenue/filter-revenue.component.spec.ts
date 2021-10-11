import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRevenueComponent } from './filter-revenue.component';

describe('FilterRevenueComponent', () => {

  let component: FilterRevenueComponent;
  let fixture: ComponentFixture<FilterRevenueComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterRevenueComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
