import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditNoteComponent } from './list-credit-note.component';

describe('ListCreditNoteComponent', () => {
  let component: ListCreditNoteComponent;
  let fixture: ComponentFixture<ListCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
