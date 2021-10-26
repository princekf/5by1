import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCostCentreComponent } from './create-cost-centre.component';

describe('CreateCostCentreComponent', () => {

  let component: CreateCostCentreComponent;
  let fixture: ComponentFixture<CreateCostCentreComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ CreateCostCentreComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(CreateCostCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
