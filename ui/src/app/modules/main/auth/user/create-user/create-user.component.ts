import { Component, OnInit } from '@angular/core';
import { User } from '@shared/entity/auth/user';

import { permissions } from '@shared/util/permissions';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

import { UserService } from '@fboservices/user.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: [ './create-user.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateUserComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create User';

  entities = permissions;

  displayedColumns = [ 'entity', 'view', 'create', 'edit', 'deleteP' ];

  dataSource = new MatTableDataSource<unknown>();

  entity = Object.entries(this.entities);

  form: FormGroup = new FormGroup({

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

  ngOnInit(): void {

    this.dataSource.data = this.entity;


    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update User';

      this.userService.get(tId, {}).subscribe((userC) => {

        this.form.setValue({
          name: userC.name ?? '',
          email: userC.email ?? '',
          password: userC.password ?? '',
          cPassword: userC.password ?? '',


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
      if (this.form.value.password !== this.form.value.cPassword) {

        this.error = 'Password and Confirm password should be same.';
        return;


      }

      this.loading = true;
      const userP = <User> this.form.value;
      this.userService.upsert(userP).subscribe(() => {

        this.toastr.success(`User ${userP.name} is saved successfully`, 'User saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving User ${userP.name}`, 'User not saved');
        console.error(error);

      });


    }

  }


}

