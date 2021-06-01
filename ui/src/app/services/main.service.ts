import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  leftMenuDrawerSubject = new BehaviorSubject(true);

  leftMenuDrawerMobileSubject = new BehaviorSubject(false);

  private leftMenuLastToggleStatus = true;

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
