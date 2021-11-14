import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Branch } from '@shared/entity/auth/branch';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { BranchService } from '@fboservices/auth/branch.service';
import { FinYearService } from '@fboservices/auth/fin-year.service';
import { FinYear } from '@shared/entity/auth/fin-year';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: [ './create-branch.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateBranchComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Branch';

  finyearFiltered: Array<FinYear> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
    address: new FormControl(''),
    finYearStartDate: new FormControl(new Date(), [ Validators.required ]),
    defaultFinYear: new FormControl(''),

  });

  branchId: string;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly branchService: BranchService,
    private readonly toastr: ToastrService,
    private readonly finYearService:FinYearService) { }

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update Branch';
      this.branchId = tId;

      const queryParam:QueryData = {
        include: [
          {relation: 'defaultFinYear'}
        ]
      };
      this.branchService.get(tId, queryParam).subscribe((branchC) => {

        this.form.setValue({
          id: branchC.id ?? '',
          name: branchC.name ?? '',
          code: branchC.code ?? '',
          email: branchC.email ?? '',
          address: branchC.address ?? '',
          finYearStartDate: branchC.finYearStartDate ?? '',
          defaultFinYear: branchC.defaultFinYear ?? ''
        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  private initValueChanges = () => {

    this.form.controls.defaultFinYear.valueChanges.subscribe((customerQ:unknown) => {

      if (typeof customerQ !== 'string') {

        return;

      }
      this.finYearService.search({ where: {name: {like: customerQ,
        options: 'i'},
      branchId: this.branchId ?? ''} })
        .subscribe((defaultFinYears) => (this.finyearFiltered = defaultFinYears));

    });

  };

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertBranch(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const branchP = <Branch> this.form.value;


    this.branchService.upsert(branchP).subscribe(() => {

      this.toastr.success(`Branch ${branchP.name} is saved successfully`, 'Branch saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Branch ${branchP.name}. ${error.error?.message}`, 'Branch not saved');
      console.error(error);

    });

  }


}
