import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCostCentreComponent } from './delete-cost-centre.component';

describe('DeleteCostCentreComponent', () => {

  let component: DeleteCostCentreComponent;
  let fixture: ComponentFixture<DeleteCostCentreComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ DeleteCostCentreComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DeleteCostCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
