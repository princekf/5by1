import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRequestLogsComponent } from './filter-request-logs.component';

describe('FilterRequestLogsComponent', () => {

  let component: FilterRequestLogsComponent;
  let fixture: ComponentFixture<FilterRequestLogsComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterRequestLogsComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterRequestLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
