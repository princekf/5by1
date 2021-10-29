import { Component, OnInit } from '@angular/core';
import { permissions as permissionsT} from '@shared/util/permissions';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { UserService } from '@fboservices/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@shared/entity/auth/user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: [ './create-user.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateUserComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create User';

  permissions = {};


  form: FormGroup = new FormGroup({

    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    cPassword: new FormControl('', [ Validators.required ]),

  });

  error: string;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly userService:UserService) { }

    private mergePermissions = (permKey: string) => {

      const perm = permissionsT[permKey];
      for (const opt in perm.operations) {

        if (!perm.operations.hasOwnProperty(opt)) {

          continue;

        }
        if (!this.permissions[permKey]) {

          this.permissions[permKey] = {...perm};
          const opt2s = this.permissions[permKey].operations;
          for (const opt2 in opt2s) {

            if (!opt2s.hasOwnProperty(opt2)) {

              continue;

            }
            opt2s[opt2] = false;

          }
          continue;

        }
        const opt2s = this.permissions[permKey].operations;
        for (const opt2 in opt2s) {

          if (!opt2s.hasOwnProperty(opt2)) {

            continue;

          }
          opt2s[opt2] = opt2s[opt2] ?? false;

        }

      }

    }

    ngOnInit(): void {

      const tId = this.route.snapshot.queryParamMap.get('id');

      if (tId) {

        this.formHeader = 'Update User';

        this.userService.get(tId, {}).subscribe((userC) => {

          this.permissions = userC.permissions ?? {};
          for (const permKey in permissionsT) {

            if (!permissionsT.hasOwnProperty(permKey)) {

              continue;

            }
            this.mergePermissions(permKey);


          }
          this.form.setValue({
            id: userC.id ?? '',
            name: userC.name ?? '',
            email: userC.email ?? '',
            password: '',
            cPassword: '',
          });

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    }


    upsertUser(): void {


      if (this.form.valid === true) {

        if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

          this.error = 'Please provide a valid email.';
          return;


        }

        this.loading = true;
        const {cPassword, ...userP} = this.form.value;
        if (this.form.value.password !== cPassword) {

          this.error = 'Password and Confirm password should be same.';
          return;


        }
        const userPerm:User = {
          permissions: this.permissions,
          ...userP
        };
        this.userService.upsert(userPerm).subscribe(() => {

          this.toastr.success(`User ${userP.name} is saved successfully`, 'User saved');
          this.goToPreviousPage(this.route, this.router);

        }, (error) => {

          const message = error.error?.message ?? `Error in saving User ${userP.name}`;
          this.loading = false;
          this.toastr.error(message, 'User not saved');

        });


      }

    }


}

