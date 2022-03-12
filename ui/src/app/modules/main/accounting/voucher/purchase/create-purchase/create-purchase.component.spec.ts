import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseComponent } from './create-purchase.component';

describe('CreatePurchaseComponent', () => {
  let component: CreatePurchaseComponent;
  let fixture: ComponentFixture<CreatePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
