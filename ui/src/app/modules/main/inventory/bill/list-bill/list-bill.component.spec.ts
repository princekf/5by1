import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillComponent } from './list-bill.component';

describe('ListBillComponent', () => {
  let component: ListBillComponent;
  let fixture: ComponentFixture<ListBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
