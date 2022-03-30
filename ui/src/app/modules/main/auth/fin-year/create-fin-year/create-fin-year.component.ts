import { Component, Inject, OnInit } from '@angular/core';

import { Branch } from '@shared/entity/auth/branch';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { BranchService } from '@fboservices/auth/branch.service';
import { FinYearService } from '@fboservices/auth/fin-year.service';
import { FinYearRangeSelectionStrategy } from '@fboutil/fin-year-range-selection-strategy';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinYear } from '@shared/entity/auth/fin-year';
import { QueryData } from '@shared/util/query-data';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-create-fin-year',
  templateUrl: './create-fin-year.component.html',
  styleUrls: [ './create-fin-year.component.scss', '../../../../../util/styles/fbo-form-style.scss' ],
  providers: [ {
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: FinYearRangeSelectionStrategy
  } ]
})
export class CreateFinYearComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Fin Year';

  branchFiltered: Array<Branch> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl('', [ Validators.required ]),
    startDate: new FormControl('', [ Validators.required ]),
    endDate: new FormControl('', [ Validators.required ]),
    branch: new FormControl('', [ Validators.required ]),


  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly branchService: BranchService,
    private readonly toastr: ToastrService,
    private readonly finYearService:FinYearService,
    @Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)
    private rangeStrategy: FinYearRangeSelectionStrategy<unknown>) { }

  ngOnInit(): void {

    this.initValueChanges();
    const tId = this.route.snapshot.queryParamMap.get('id');
    this.form.controls.startDate.disable();
    this.form.controls.endDate.disable();
    if (tId) {

      this.formHeader = 'Update Fin Year';

      const queryParam:QueryData = {
        include: [
          {relation: 'branch'}
        ]
      };
      this.finYearService.get(tId, queryParam).subscribe((finyearC) => {

        this.form.setValue({
          id: finyearC.id ?? '',
          name: finyearC.name ?? '',
          code: finyearC.name ?? '',
          branch: finyearC.branch ?? '',
          startDate: finyearC.startDate ?? '',
          endDate: finyearC.endDate ?? '',

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

        const branch = branchQ as Branch;
        this.rangeStrategy.startDate = {
          month: branch.finYearStartDate.getMonth(),
          date: branch.finYearStartDate.getDate(),
        };
        this.form.controls.startDate.enable();
        this.form.controls.endDate.enable();
        return;

      }
      this.form.controls.startDate.disable();
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
    const finyearT = <FinYear> this.form.value;
    const finyearP = {...finyearT};
    const {startDate, endDate} = finyearP;
    const format = 'DD/MM/YYYY';
    const sDateF = dayjs(startDate).format(format);
    const eDateF = dayjs(endDate).format(format);
    const sDateP = dayjs.utc(sDateF, format);
    const eDateP = dayjs.utc(eDateF, format);
    finyearP.startDate = sDateP.toDate();
    finyearP.endDate = eDateP.toDate();
    this.finYearService.upsert(finyearP).subscribe(() => {

      this.toastr.success(`Fin-year ${finyearP.name} is saved successfully`, 'Fin-year saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Fin-year ${finyearP.name}. ${error.error?.message}`, 'Fin-year not saved');
      console.error(error);

    });

  }

}
