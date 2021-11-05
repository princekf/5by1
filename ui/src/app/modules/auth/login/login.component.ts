import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@fboservices/user.service';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ '../common/login-register.scss' ]
})
export class LoginComponent {

  error: string | null;

  loading = false;
  hide = true;
 
  form: FormGroup = new FormGroup({

    email: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    company: new FormControl('', [ Validators.required ]),

  });

  constructor(private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit():void {

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.router.navigate([ '/' ]);

    }

  }

  submit(): void {

    if (this.form.valid === true) {

      this.loading = true;
      this.error = null;
      this.userService.login(this.form.value).subscribe((authResp) => {

        this.loading = false;
        localStorage.setItem(ACCESS_TOKEN_ID, authResp.token);
        goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.error = error.error.message;

        if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

          this.error = 'Please provide a valid email.';

        }

      });

    }

  }

}
