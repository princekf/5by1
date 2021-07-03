import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransactionComponent } from './list-transaction.component';

describe('ListTransactionComponent', () => {
  let component: ListTransactionComponent;
  let fixture: ComponentFixture<ListTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
