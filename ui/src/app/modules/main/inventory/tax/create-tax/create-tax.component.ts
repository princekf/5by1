import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from '@fboservices/inventory/tax.service';

const MAX_RATE = 100;
@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: [ './create-tax.component.scss' ]
})
export class CreateTaxComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  form: FormGroup = new FormGroup({
    groupName: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.required ]),
    rate: new FormControl('', [ Validators.required, Validators.min(0) ]),
    appliedTo: new FormControl('100', [ Validators.required, Validators.min(0), Validators.max(MAX_RATE) ]),
    description: new FormControl(''),
  });

  constructor(private readonly router: Router,
    private route: ActivatedRoute,
    private readonly taxService:TaxService) { }

  ngOnInit(): void {
  }

  goToTaxes(): void {


    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/tax' ], {queryParams: uParams});

  }

  upsertTax(): void {

    this.taxService.save(this.form.value).subscribe((taxC) => {

      this.goToTaxes();

    }, (error) => {

      console.error(error);

    });

  }

}
