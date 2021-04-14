import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit():void {
  }

  logout = ():void => {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    this.router.navigate([ '/login' ]);

  }

}
