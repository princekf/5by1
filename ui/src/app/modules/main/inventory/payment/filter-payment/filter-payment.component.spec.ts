import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPaymentComponent } from './filter-payment.component';

describe('FilterPaymentComponent', () => {

  let component: FilterPaymentComponent;
  let fixture: ComponentFixture<FilterPaymentComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterPaymentComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
