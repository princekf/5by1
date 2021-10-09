import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTransferComponent } from './filter-transfer.component';

describe('FilterTransferComponent', () => {

  let component: FilterTransferComponent;
  let fixture: ComponentFixture<FilterTransferComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ FilterTransferComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(FilterTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
