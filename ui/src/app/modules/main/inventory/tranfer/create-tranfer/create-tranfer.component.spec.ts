import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTranferComponent } from './create-tranfer.component';

describe('CreateTranferComponent', () => {
  let component: CreateTranferComponent;
  let fixture: ComponentFixture<CreateTranferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTranferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTranferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
