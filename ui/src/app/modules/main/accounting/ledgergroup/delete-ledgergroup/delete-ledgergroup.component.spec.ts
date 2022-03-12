import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLedgergroupComponent } from './delete-ledgergroup.component';

describe('DeleteLedgergroupComponent', () => {

  let component: DeleteLedgergroupComponent;
  let fixture: ComponentFixture<DeleteLedgergroupComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ DeleteLedgergroupComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DeleteLedgergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
