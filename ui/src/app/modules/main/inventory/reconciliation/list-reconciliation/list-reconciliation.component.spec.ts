import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReconciliationComponent } from './list-reconciliation.component';

describe('ListReconciliationComponent', () => {
  let component: ListReconciliationComponent;
  let fixture: ComponentFixture<ListReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReconciliationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
