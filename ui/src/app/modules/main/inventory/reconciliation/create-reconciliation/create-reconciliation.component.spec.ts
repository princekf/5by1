import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReconciliationComponent } from './create-reconciliation.component';

describe('CreateReconciliationComponent', () => {
  let component: CreateReconciliationComponent;
  let fixture: ComponentFixture<CreateReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReconciliationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
