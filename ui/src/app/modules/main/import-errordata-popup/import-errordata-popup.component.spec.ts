import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportErrordataPopupComponent } from './import-errordata-popup.component';

describe('ImportErrordataPopupComponent', () => {

  let component: ImportErrordataPopupComponent;
  let fixture: ComponentFixture<ImportErrordataPopupComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ ImportErrordataPopupComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ImportErrordataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
