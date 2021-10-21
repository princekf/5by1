import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFinYearComponent } from './list-fin-year.component';

describe('ListFinYearComponent', () => {

  let component: ListFinYearComponent;
  let fixture: ComponentFixture<ListFinYearComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ ListFinYearComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ListFinYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
