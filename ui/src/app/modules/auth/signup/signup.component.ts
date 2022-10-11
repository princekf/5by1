import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';
import { ToastrService } from 'ngx-toastr';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../common/login-register.scss' ],
})
export class SignupComponent {

  error: string | null;

  loading = false;


  question = '';

  form: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required ]),
    answer: new FormControl('', [ Validators.required ]),
  });

  constructor(private readonly userService:UserService,
    private readonly router:Router,
    private readonly toastr: ToastrService) {}

  ngOnInit():void {

    this.userService.captcha().subscribe((resp) => {

      const { question, token } = resp;
      localStorage.setItem(ACCESS_TOKEN_ID, token);
      this.question = question;

    });

  }

  submit():void {

    this.error = null;
    if (this.form.valid === true) {

      if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

        this.error = 'Please provide a valid email.';
        return;


      }

      this.loading = true;
      const { email, answer} = this.form.value as {name:string, email:string, answer: string};
      this.userService.initiateSignUp({email,
        answer}).subscribe((userR) => {

        this.toastr.info(`Sign up completed for the user ${userR.email}`, 'Sign-Up');
        localStorage.removeItem(ACCESS_TOKEN_ID);
        this.loading = false;
        this.router.navigateByUrl('/');

      }, (error) => {

        this.userService.captcha().subscribe((resp) => {

          const { question, token } = resp;
          localStorage.setItem(ACCESS_TOKEN_ID, token);
          this.question = question;

        });
        this.loading = false;
        this.error = error.error.message;

      });

    }

  }

  goToLogin(): void {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    this.router.navigateByUrl('/');

  }

}
