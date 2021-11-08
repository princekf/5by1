import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReceiptComponent } from './list-receipt.component';

describe('ListReceiptComponent', () => {
  let component: ListReceiptComponent;
  let fixture: ComponentFixture<ListReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
