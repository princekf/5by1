import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCostCentreComponent } from './list-cost-centre.component';

describe('ListCostCentreComponent', () => {

  let component: ListCostCentreComponent;
  let fixture: ComponentFixture<ListCostCentreComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ ListCostCentreComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ListCostCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
