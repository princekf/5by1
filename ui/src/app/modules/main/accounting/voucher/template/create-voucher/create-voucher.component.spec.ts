import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVoucherComponent } from './create-voucher.component';

describe('CreateVoucherComponent', () => {
  let component: CreateVoucherComponent;
  let fixture: ComponentFixture<CreateVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
