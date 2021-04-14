import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ './signup.component.scss', '../../shared/style/login-register.scss' ]
})
export class SignupComponent {

  error: string | null;

  loading = false;

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    cPassword: new FormControl(''),
  });

  constructor(private readonly userService:UserService,
    private readonly router:Router) {}

  submit():void {

    this.error = null;
    if (!this.form.value.name) {

      this.error = 'Name should not be empty.';
      return;

    }
    if (!this.form.value.password) {

      this.error = 'Password should not be empty.';
      return;

    }
    if (this.form.value.password !== this.form.value.cPassword) {

      this.error = 'Password and confirm password should be same.';
      return;

    }
    if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

      this.error = 'Please provide a valid email.';
      return;

    }
    this.loading = true;
    this.userService.signUp(this.form.value).subscribe((message) => {

      this.loading = false;
      this.router.navigateByUrl('/');

    }, (error) => {

      this.loading = false;
      this.error = error.error.message;

    });


  }

}
