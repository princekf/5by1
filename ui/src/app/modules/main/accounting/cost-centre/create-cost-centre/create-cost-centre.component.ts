import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import {CostCentreService } from '@fboservices/accounting/cost-centre.service';


@Component({
  selector: 'app-create-cost-centre',
  templateUrl: './create-cost-centre.component.html',
  styleUrls: [ './create-cost-centre.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCostCentreComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create CostCentre';


  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    name: new FormControl('', [ Validators.required ]),

    details: new FormControl('', [ Validators.required ]),

  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly costCentreService: CostCentreService,
    private readonly toastr: ToastrService,) { }

  ngOnInit(): void {


    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update CostCentre';

      this.costCentreService.get(tId, {}).subscribe((CostCentreC) => {

        this.form.setValue({
          id: CostCentreC.id ?? '',
          name: CostCentreC.name ?? '',
          details: CostCentreC.details ?? '',

        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }


  upsertCostCentre(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const CostCentreP = <CostCentre> this.form.value;


    this.costCentreService.upsert(CostCentreP).subscribe(() => {

      this.toastr.success(`CostCentre ${CostCentreP.name} is saved successfully`, 'CostCentre saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving CostCentre ${CostCentreP.name}`, 'CostCentre not saved');
      console.error(error);

    });

  }


}
