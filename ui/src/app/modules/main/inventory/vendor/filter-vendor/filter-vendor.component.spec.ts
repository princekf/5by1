import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVendorComponent } from './filter-vendor.component';

describe('FilterVendorComponent', () => {

  let component: FilterVendorComponent;
  let fixture: ComponentFixture<FilterVendorComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterVendorComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
