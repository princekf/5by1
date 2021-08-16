import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRevenueComponent } from './list-revenue.component';

describe('ListRevenueComponent', () => {
  let component: ListRevenueComponent;
  let fixture: ComponentFixture<ListRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
