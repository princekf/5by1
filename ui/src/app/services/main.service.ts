import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const MOBILE_SCREEN_MAX_WIDTH = 768;
@Injectable({
  providedIn: 'root'
})
export class MainService {

  leftMenuDrawerSubject = new BehaviorSubject(true);

  leftMenuDrawerMobileSubject = new BehaviorSubject(false);

  private leftMenuLastToggleStatus = true;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  isMobileView = ():boolean => this.document.defaultView.innerWidth <= MOBILE_SCREEN_MAX_WIDTH;

  setLeftMenuDrawerSubject = (val:boolean):void => {

    this.leftMenuDrawerSubject.next(val);

  }

  getLeftMenuLastToggleStatus = ():boolean => this.leftMenuLastToggleStatus;

  toggleLeftMenuDrawer = ():void => {

    this.leftMenuDrawerSubject.next(!this.leftMenuDrawerSubject.value);
    this.leftMenuLastToggleStatus = this.leftMenuDrawerSubject.value;


  }

  showLeftMenuDrawer = ():void => {

    this.leftMenuDrawerMobileSubject.next(true);

  }

  private export = new BehaviorSubject<any>({});

  setExport(products: any): void {

    this.export.next(products);

  }

  getExport(): Observable<any> {

    return this.export.asObservable();

  }

}
