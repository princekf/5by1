import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPurchaseComponent } from './list-purchase.component';

describe('ListPurchaseComponent', () => {
  let component: ListPurchaseComponent;
  let fixture: ComponentFixture<ListPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
