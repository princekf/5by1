import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLedgergroupComponent } from './create-ledgergroup.component';

describe('CreateLedgergroupComponent', () => {

  let component: CreateLedgergroupComponent;
  let fixture: ComponentFixture<CreateLedgergroupComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ CreateLedgergroupComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(CreateLedgergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
