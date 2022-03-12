import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';
import { Tax } from '@shared/entity/inventory/tax';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
const MAX_RATE = 100;

@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: [ './create-tax.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateTaxComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Taxes';

  loading = false;

  groupNameOptions: Observable<string[]>;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    groupName: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.required ]),
    rate: new FormControl(0, [ Validators.required, Validators.min(0) ]),
    appliedTo: new FormControl(MAX_RATE, [ Validators.required, Validators.min(0), Validators.max(MAX_RATE) ]),
    description: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly taxService:TaxService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    this.groupNameOptions = this.form.controls.groupName.valueChanges
      .pipe(flatMap((nameQ) => this.taxService.distinct('groupName', { where: {groupName: {like: nameQ,
        options: 'i'}}})))
      .pipe(map((groupNameResp) => groupNameResp.data));


    const tId = this.route.snapshot.queryParamMap.get('id');
    if (tId) {

      this.formHeader = 'Update Taxes';
      this.loading = true;
      this.taxService.get(tId, {}).subscribe((taxC) => {

        this.form.setValue({id: taxC.id,
          groupName: taxC.groupName,
          name: taxC.name,
          rate: taxC.rate,
          appliedTo: taxC.appliedTo,
          description: taxC.description});

        this.loading = false;

      });

    }

  }

  upsertTax(): void {

    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const taxP = <Tax> this.form.value;
    this.taxService.upsert(taxP).subscribe(() => {

      this.toastr.success(`Tax ${taxP.name} is saved successfully`, 'Tax saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving tax ${taxP.name}`, 'Tax not saved');
      console.error(error);

    });

  }

}
