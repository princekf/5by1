import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';
import { PICK_FORMATS } from '@fboutil/date-picker-adapter';
import { MonthDatePickerAdapter } from '@fboutil/month-date-picker-adapter';
import { ACCESS_TOKEN_ID } from '@shared/Constants';

const DEC = 11;
const THRITY_ONE = 31;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
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
export class VerifyEmailComponent implements OnInit {

  error: string | null;

  loading = false;

  showP1 = false;

  showP2 = false;

  yearStart = new Date(new Date().getFullYear(), 0, 1);

  yearEnd = new Date(new Date().getFullYear(), DEC, THRITY_ONE);

  question = '';

  form: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    cPassword: new FormControl('', [ Validators.required ]),
    companyName: new FormControl('', [ Validators.required ]),
    companyCode: new FormControl('', [ Validators.required ]),
    finYearStart: new FormControl(new Date(), [ Validators.required ]),
    answer: new FormControl('', [ Validators.required ]),
  });

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService:UserService,) { }

  ngOnInit(): void {

    this.loading = true;
    const APRIL = 3;
    const finStart = new Date(0, APRIL, 1);
    const signLogId = this.route.snapshot.paramMap.get('token');
    this.userService.fetchSignUpData(signLogId).subscribe((signLog) => {

      const {email} = signLog;
      this.form.controls.email.setValue(email);
      this.form.controls.finYearStart.setValue(finStart);
      this.userService.captcha().subscribe((resp) => {

        const { question, token } = resp;
        localStorage.setItem(ACCESS_TOKEN_ID, token);
        this.question = question;

        this.loading = false;

      });

    });

  }

  submit():void {
  }

}
