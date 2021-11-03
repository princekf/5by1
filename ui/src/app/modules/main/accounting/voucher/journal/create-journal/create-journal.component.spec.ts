import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJournalComponent } from './create-journal.component';

describe('CreateJournalComponent', () => {
  let component: CreateJournalComponent;
  let fixture: ComponentFixture<CreateJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
