import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss', '../../shared/style/login-register.scss' ]
})
export class LoginComponent {

  error: string | null;

  loading = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private readonly userService:UserService,
    private readonly router:Router) {}

  submit():void {

    if (!this.form.value.email) {

      this.error = 'Please input your email';
      return;

    }
    if (!this.form.value.password) {

      this.error = 'Please input your password';
      return;

    }

    this.loading = true;
    this.error = null;
    this.userService.login(this.form.value).subscribe((message) => {

      this.loading = false;
      this.router.navigateByUrl('/');

    }, (error) => {

      this.loading = false;
      this.error = error.error.message;

    });


  }

}
