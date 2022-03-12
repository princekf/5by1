import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFinYearComponent } from './create-fin-year.component';

describe('CreateFinYearComponent', () => {

  let component: CreateFinYearComponent;
  let fixture: ComponentFixture<CreateFinYearComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ CreateFinYearComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(CreateFinYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
