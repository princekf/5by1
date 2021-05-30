import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppAuthGuard } from './util/app.authguard';
import { AppNoAuthGuard } from './util/app.noauthguard';
import { HTTPInterceptor } from './util/http.interceptor';

const routes: Routes = [
  {
    canActivate: [ ],
    path: '',
    loadChildren: () => import('./components/main/main.module').then((mod) => mod.MainModule)
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    },
    AppAuthGuard,
    AppNoAuthGuard
  ]
})
export class AppRoutingModule { }
