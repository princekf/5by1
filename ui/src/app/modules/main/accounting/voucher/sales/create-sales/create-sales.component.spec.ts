import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalesComponent } from './create-sales.component';

describe('CreateSalesComponent', () => {
  let component: CreateSalesComponent;
  let fixture: ComponentFixture<CreateSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
