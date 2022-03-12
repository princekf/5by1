import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCostCentreComponent } from './filter-cost-centre.component';

describe('FilterCostCentreComponent', () => {

  let component: FilterCostCentreComponent;
  let fixture: ComponentFixture<FilterCostCentreComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterCostCentreComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterCostCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
