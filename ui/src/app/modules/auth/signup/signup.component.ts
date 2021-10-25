import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../common/login-register.scss' ]
})
export class SignupComponent {

  error: string | null;

  loading = false;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    cPassword: new FormControl('', [ Validators.required ]),
  });

  constructor(private readonly userService:UserService,
    private readonly router:Router,
    private readonly toastr: ToastrService) {}

  submit():void {

    this.error = null;
    if (this.form.valid === true) {

      if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

        this.error = 'Please provide a valid email.';
        return;


      }
      if (this.form.value.password !== this.form.value.cPassword) {

        this.error = 'Password and confirm password should be same.';
        return;


      }

      this.loading = true;
      const {name, email, password} = this.form.value as {name:string, email:string, password:string};
      this.userService.signUp({name,
        email,
        password}).subscribe((userR) => {

        this.toastr.info(`Sign up completed for the user ${userR.name}, ${userR.email}`, 'Sign-Up');
        this.loading = false;
        this.router.navigateByUrl('/');

      }, (error) => {

        this.loading = false;
        this.error = error.error.message;

      });


    }

  }

}
