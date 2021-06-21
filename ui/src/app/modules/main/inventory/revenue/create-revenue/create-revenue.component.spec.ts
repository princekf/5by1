import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRevenueComponent } from './create-revenue.component';

describe('CreateRevenueComponent', () => {
  let component: CreateRevenueComponent;
  let fixture: ComponentFixture<CreateRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
