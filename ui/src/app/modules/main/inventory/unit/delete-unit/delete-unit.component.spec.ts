import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUnitComponent } from './delete-unit.component';

describe('DeleteUnitComponent', () => {
  let component: DeleteUnitComponent;
  let fixture: ComponentFixture<DeleteUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
