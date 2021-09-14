import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Unit } from '@shared/entity/inventory/unit';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: [ './create-unit.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateUnitComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Units';

  loading = false;

  units: Array<Unit> = [];

  timesConditionallyRequiredValidator = (formControl: AbstractControl): ValidationErrors => {

    if (!formControl.parent) {

      return null;

    }
    if (formControl.parent.get('parent').value) {

      let errors = Validators.required(formControl);
      if (!errors) {

        errors = Validators.min(1)(formControl);

      }
      return errors;

    }
    return null;

  }

  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl('', [ Validators.required ]),
    parent: new FormControl(''),
    times: new FormControl(1, [ this.timesConditionallyRequiredValidator ]),
    decimalPlaces: new FormControl('', [ Validators.required, Validators.min(0) ]),
    description: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly unitService:UnitService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');
    this.loading = true;
    this.unitService.search({}).subscribe((units) => {

      this.units = units;
      if (tId) {

        this.formHeader = 'Update Units';
        const queryParam:QueryData = {
          include: [
            {relation: 'parent'}
          ]
        };
        this.unitService.get(tId, queryParam).subscribe((unitC) => {

          this.fboForm.setValue({id: unitC.id,
            name: unitC.name,
            code: unitC.code,
            parent: unitC.parent ?? '',
            times: unitC.times ?? 1,
            decimalPlaces: unitC.decimalPlaces ?? 0,
            description: unitC.description ?? ''});

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    });


  }

  upsertUnit(): void {

    if (!this.fboForm.valid) {

      return;

    }
    this.loading = true;
    const unitP = <Unit> this.fboForm.value;
    this.unitService.upsert(unitP).subscribe(() => {

      this.toastr.success(`Unit ${unitP.name} is saved successfully`, 'Unit saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving unit ${unitP.name}`, 'Unit not saved');
      console.error(error);

    });

  }

}
