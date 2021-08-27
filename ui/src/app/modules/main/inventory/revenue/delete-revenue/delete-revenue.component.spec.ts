import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRevenueComponent } from './delete-revenue.component';

describe('DeleteRevenueComponent', () => {

  let component: DeleteRevenueComponent;
  let fixture: ComponentFixture<DeleteRevenueComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ DeleteRevenueComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DeleteRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
