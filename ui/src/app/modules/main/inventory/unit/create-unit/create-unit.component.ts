import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: [ './create-unit.component.scss' ]
})
export class CreateUnitComponent implements OnInit {

  formHeader = 'Create Units';

  loading = false;

  units: Array<Unit> = [];

  groupNameOptions: Observable<string[]>;

  // TODO Implement validation : https://angular.io/guide/form-validation
  form: FormGroup = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    code: new FormControl('', [ Validators.required ]),
    parent: new FormControl(''),
    times: new FormControl('', [ Validators.min(1) ]),
    decimalPlaces: new FormControl('', [ Validators.min(0) ]),
    description: new FormControl('', [ Validators.required ]),
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

          this.form.setValue({_id: unitC._id,
            name: unitC.name,
            code: unitC.code,
            parent: unitC.parent,
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

    this.loading = true;
    const unitP = <Unit> this.form.value;
    (unitP._id ? this.unitService.update(unitP) : this.unitService.save(unitP)).subscribe((unitC) => {

      this.toastr.success('Unit saved', `Unit ${unitC.name} is saved successfully`);
      this.goToUnits();

    }, (error) => {

      this.loading = false;
      this.toastr.error('Unit not saved', `Error in saving unit ${unitP.name}`);
      console.error(error);

    });

  }

}
