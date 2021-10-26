import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Company } from '@shared/entity/auth/company';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { CompanyService } from '@fboservices/auth/company.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: [ './create-company.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCompanyComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create company';

  error: string;

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    name: new FormControl('', [ Validators.required ]),

    code: new FormControl('', [ Validators.required ]),

    email: new FormControl('', [ Validators.required ]),

    address: new FormControl('', [ Validators.required ]),

    password: new FormControl('', [ Validators.required ]),


  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly companyService: CompanyService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update Company';
      this.companyService.get(tId, {}).subscribe((companyC) => {

        this.form.setValue({
          id: companyC.id ?? '',
          name: companyC.name ?? '',
          code: companyC.code ?? '',
          email: companyC.email ?? '',
          address: companyC.address ?? '',
          password: companyC.password ?? '',


        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  upsertCompany(): void {

    if (this.form.valid === true) {

      if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

        this.error = 'Please provide a valid email.';
        return;


      }

      this.loading = true;
      const companyP = <Company> this.form.value;

      this.companyService.upsert(companyP).subscribe(() => {

        this.toastr.success(`Company ${companyP.name} is saved successfully`, 'Company saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving Company ${companyP.name}`, 'Company not saved');
        console.error(error);

      });

    }

  }

}
