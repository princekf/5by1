import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

}
