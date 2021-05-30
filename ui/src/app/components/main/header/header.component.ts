import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  leftMenuDrawerOpened = true;

  constructor(private readonly mainService: MainService) {

    this.mainService.leftMenuDrawerSubject.subscribe((opened) => (this.leftMenuDrawerOpened = opened));

  }

  ngOnInit(): void {
  }

  toggleLeftMenuDrawer = ():void => {

    this.mainService.toggleLeftMenuDrawer();

  }

}
