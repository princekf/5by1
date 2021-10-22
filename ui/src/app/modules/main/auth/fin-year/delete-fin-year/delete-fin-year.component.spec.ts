import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFinYearComponent } from './delete-fin-year.component';

describe('DeleteFinYearComponent', () => {

  let component: DeleteFinYearComponent;
  let fixture: ComponentFixture<DeleteFinYearComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ DeleteFinYearComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DeleteFinYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
