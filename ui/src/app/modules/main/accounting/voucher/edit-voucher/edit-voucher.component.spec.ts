import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoucherComponent } from './edit-voucher.component';

describe('EditVoucherComponent', () => {
  let component: EditVoucherComponent;
  let fixture: ComponentFixture<EditVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
