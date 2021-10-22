import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLedgerComponent } from './delete-ledger.component';

describe('DeleteLedgerComponent', () => {

  let component: DeleteLedgerComponent;
  let fixture: ComponentFixture<DeleteLedgerComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ DeleteLedgerComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DeleteLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
