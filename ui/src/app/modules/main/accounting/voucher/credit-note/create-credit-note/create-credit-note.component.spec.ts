import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditNoteComponent } from './create-credit-note.component';

describe('CreateCreditNoteComponent', () => {
  let component: CreateCreditNoteComponent;
  let fixture: ComponentFixture<CreateCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
