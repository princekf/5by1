import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';
import { PICK_FORMATS } from '@fboutil/date-picker-adapter';
import { MonthDatePickerAdapter } from '@fboutil/month-date-picker-adapter';
import { ToastrService } from 'ngx-toastr';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../common/login-register.scss' ],
  providers: [
    {provide: DateAdapter,
      useClass: MonthDatePickerAdapter},
    {
      provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    }
  ]
})
export class SignupComponent {

  error: string | null;

  loading = false;


  question = '';

  form: FormGroup = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
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
      const {name, email, answer} = this.form.value as {name:string, email:string, answer: string};
      this.userService.signUp({name,
        email,
        answer}).subscribe((userR) => {

        this.toastr.info(`Sign up completed for the user ${userR.name}, ${userR.email}`, 'Sign-Up');
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
