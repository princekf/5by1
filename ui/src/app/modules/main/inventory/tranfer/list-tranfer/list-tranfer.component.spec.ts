import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTranferComponent } from './list-tranfer.component';

describe('ListTranferComponent', () => {
  let component: ListTranferComponent;
  let fixture: ComponentFixture<ListTranferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTranferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTranferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
