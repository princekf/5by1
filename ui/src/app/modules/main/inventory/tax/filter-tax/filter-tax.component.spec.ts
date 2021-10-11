import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTaxComponent } from './filter-tax.component';

describe('FilterTaxComponent', () => {

  let component: FilterTaxComponent;
  let fixture: ComponentFixture<FilterTaxComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterTaxComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
