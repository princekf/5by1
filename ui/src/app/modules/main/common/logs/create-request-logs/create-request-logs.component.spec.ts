import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestLogsComponent } from './create-request-logs.component';

describe('CreateRequestLogsComponent', () => {

  let component: CreateRequestLogsComponent;
  let fixture: ComponentFixture<CreateRequestLogsComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ CreateRequestLogsComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(CreateRequestLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
