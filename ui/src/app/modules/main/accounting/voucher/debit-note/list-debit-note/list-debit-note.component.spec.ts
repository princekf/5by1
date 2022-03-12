import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDebitNoteComponent } from './list-debit-note.component';

describe('ListDebitNoteComponent', () => {
  let component: ListDebitNoteComponent;
  let fixture: ComponentFixture<ListDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDebitNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
