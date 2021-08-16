import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransferComponent } from './list-transfer.component';

describe('ListTransferComponent', () => {
  let component: ListTransferComponent;
  let fixture: ComponentFixture<ListTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
