import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVoucherComponent } from './delete-voucher.component';

describe('DeleteVoucherComponent', () => {
  let component: DeleteVoucherComponent;
  let fixture: ComponentFixture<DeleteVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
