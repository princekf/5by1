import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterReceiptComponent } from './filter-receipt.component';

describe('FilterReceiptComponent', () => {
  let component: FilterReceiptComponent;
  let fixture: ComponentFixture<FilterReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
