import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBankComponent } from './delete-bank.component';

describe('DeleteBankComponent', () => {
  let component: DeleteBankComponent;
  let fixture: ComponentFixture<DeleteBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
