import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVendorComponent } from './delete-vendor.component';

describe('DeleteVendorComponent', () => {
  let component: DeleteVendorComponent;
  let fixture: ComponentFixture<DeleteVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
