import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContraComponent } from './list-contra.component';

describe('ListContraComponent', () => {
  let component: ListContraComponent;
  let fixture: ComponentFixture<ListContraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListContraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
