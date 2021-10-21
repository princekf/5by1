import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFinYearComponent } from './filter-fin-year.component';

describe('FilterFinYearComponent', () => {

  let component: FilterFinYearComponent;
  let fixture: ComponentFixture<FilterFinYearComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterFinYearComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterFinYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
