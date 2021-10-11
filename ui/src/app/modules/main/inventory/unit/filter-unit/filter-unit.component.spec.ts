import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterUnitComponent } from './filter-unit.component';

describe('FilterUnitComponent', () => {

  let component: FilterUnitComponent;
  let fixture: ComponentFixture<FilterUnitComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterUnitComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
