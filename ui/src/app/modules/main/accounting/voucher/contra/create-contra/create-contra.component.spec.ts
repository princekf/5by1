import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContraComponent } from './create-contra.component';

describe('CreateContraComponent', () => {
  let component: CreateContraComponent;
  let fixture: ComponentFixture<CreateContraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateContraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
