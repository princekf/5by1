import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransactionComponent } from './delete-transaction.component';

describe('DeleteTransactionComponent', () => {
  let component: DeleteTransactionComponent;
  let fixture: ComponentFixture<DeleteTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
