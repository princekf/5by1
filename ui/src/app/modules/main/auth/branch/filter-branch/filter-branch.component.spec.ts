import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBranchComponent } from './filter-branch.component';

describe('FilterBranchComponent', () => {

  let component: FilterBranchComponent;
  let fixture: ComponentFixture<FilterBranchComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterBranchComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
