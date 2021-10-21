import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCompanyComponent } from './filter-company.component';

describe('FilterCompanyComponent', () => {

  let component: FilterCompanyComponent;
  let fixture: ComponentFixture<FilterCompanyComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterCompanyComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
