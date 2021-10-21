import { Component, OnInit } from '@angular/core';

import { Branch } from '@shared/entity/auth/branch';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { BranchService } from '@fboservices/auth/branch.service';
import { FinYearService } from '@fboservices/auth/fin-year.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinYear } from '@shared/entity/auth/fin-year';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-fin-year',
  templateUrl: './create-fin-year.component.html',
  styleUrls: [ './create-fin-year.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateFinYearComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Fin Year';

  branchFiltered: Array<Branch> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    name: new FormControl('', [ Validators.required ]),

    startDate: new FormControl(new Date(), [ Validators.required ]),

    endDate: new FormControl('', [ Validators.required ]),

    branch: new FormControl('',[ Validators.required ]),


  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly branchService: BranchService,
    private readonly toastr: ToastrService,
    private readonly finYearService:FinYearService) { }

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update Fin Year';

      const queryParam:QueryData = {
        include: [
          {relation: 'branch'}
        ]
      };
      this.finYearService.get(tId, queryParam).subscribe((bankC) => {

        this.form.setValue({
          id: bankC.id ?? '',
          name: bankC.name ?? '',
          startDate: bankC.startDate ?? '',
          endDate: bankC.endDate ?? '',
          branch: bankC.branch ?? '',

        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  private initValueChanges = () => {

    this.form.controls.branch.valueChanges.subscribe((branchQ:unknown) => {

      if (typeof branchQ !== 'string') {

        return;

      }
      this.branchService.search({ where: {name: {like: branchQ,
        options: 'i'}} })
        .subscribe((branch) => (this.branchFiltered = branch));

    });

  };

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertFinyear(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const FinyearP = <FinYear> this.form.value;


    this.finYearService.upsert(FinyearP).subscribe(() => {

      this.toastr.success(`Fin-year ${FinyearP.name} is saved successfully`, 'Fin-year saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Fin-year ${FinyearP.name}`, 'Fin-year not saved');
      console.error(error);

    });

  }



}
