import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransferComponent } from './delete-transfer.component';

describe('DeleteTransferComponent', () => {
  let component: DeleteTransferComponent;
  let fixture: ComponentFixture<DeleteTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
