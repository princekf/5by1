import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: [ './create-unit.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateUnitComponent implements OnInit {

  formHeader = 'Create Units';

  loading = false;

  units: Array<Unit> = [];

  groupNameOptions: Observable<string[]>;

  timesConditionallyRequiredValidator = (formControl: AbstractControl): ValidationErrors => {

    if (!formControl.parent) {

      return null;

    }
    if (formControl.parent.get('baseUnit').value) {

      let errors = Validators.required(formControl);
      if (!errors) {

        errors = Validators.min(1)(formControl);

      }
      return errors;

    }
    return null;

  }

  fboForm: FormGroup = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl('', [ Validators.required ]),
    baseUnit: new FormControl(''),
    times: new FormControl('', [ this.timesConditionallyRequiredValidator ]),
    decimalPlaces: new FormControl('', [ Validators.required, Validators.min(0) ]),
    description: new FormControl(''),
  });

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly unitService:UnitService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');
    this.loading = true;
    this.unitService.listAll().subscribe((units) => {

      this.units = units;
      if (tId) {

        this.formHeader = 'Update Units';
        this.unitService.get(tId).subscribe((unitC) => {

          this.fboForm.setValue({_id: unitC._id,
            name: unitC.name,
            code: unitC.code,
            baseUnit: unitC.baseUnit,
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


  goToUnits(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/unit' ], {queryParams: uParams});

  }

  upsertUnit(): void {

    if (!this.fboForm.valid) {

      return;

    }
    this.loading = true;
    const unitP = <Unit> this.fboForm.value;
    (unitP._id ? this.unitService.update(unitP) : this.unitService.save(unitP)).subscribe((unitC) => {

      this.toastr.success(`Unit ${unitC.name} is saved successfully`, 'Unit saved');
      this.goToUnits();

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving unit ${unitP.name}`, 'Unit not saved');
      console.error(error);

    });

  }

}
