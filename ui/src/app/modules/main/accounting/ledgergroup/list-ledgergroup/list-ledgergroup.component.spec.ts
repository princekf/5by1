import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLedgergroupComponent } from './list-ledgergroup.component';

describe('ListLedgergroupComponent', () => {

  let component: ListLedgergroupComponent;
  let fixture: ComponentFixture<ListLedgergroupComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ ListLedgergroupComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ListLedgergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
