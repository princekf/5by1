import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInvoiceComponent } from './filter-invoice.component';

describe('FilterInvoiceComponent', () => {

  let component: FilterInvoiceComponent;
  let fixture: ComponentFixture<FilterInvoiceComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterInvoiceComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
