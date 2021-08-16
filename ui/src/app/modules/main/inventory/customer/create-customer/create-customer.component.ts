import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { Customer } from '@shared/entity/inventory/customer';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: [ './create-customer.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCustomerComponent implements OnInit {


  formHeader = 'Create Units';

  loading = false;

  states: Array<string> = [];

  statesOptions: Observable<string[]>;

  fboForm: FormGroup = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl(''),
    mobile: new FormControl(''),
    state: new FormControl(''),
    address: new FormControl(''),
    gstNo: new FormControl(''),
  });

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.states.filter((option) => option.toLowerCase().includes(filterValue));

  }

  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customerService:CustomerService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    this.statesOptions = this.fboForm.controls.state.valueChanges.pipe(
      startWith(''), map((value) => this._filter(value))
    );
    this.customerService.getStates().subscribe((groupNames) => {

      this.states = groupNames;

    });

    const tId = this.route.snapshot.queryParamMap.get('id');
    if (tId) {

      this.formHeader = 'Update Customers';
      this.loading = true;
      this.customerService.get(tId).subscribe((taxC) => {

        this.fboForm.setValue({_id: taxC._id,
          name: taxC.name,
          email: taxC.email,
          mobile: taxC.mobile,
          state: taxC.state,
          address: taxC.address,
          gstNo: taxC.gstNo, });

        this.loading = false;

      });

    }

  }


  goToCustomers(): void {

    const burl = this.route.snapshot.queryParamMap.get('burl');
    const uParams:Record<string, string> = {};
    if (burl?.includes('?')) {

      const httpParams = new HttpParams({ fromString: burl.split('?')[1] });
      const keys = httpParams.keys();
      keys.forEach((key) => (uParams[key] = httpParams.get(key)));

    }
    this.router.navigate([ '/customer' ], {queryParams: uParams});

  }

  upsertCustomer(): void {

    if (!this.fboForm.valid) {

      return;

    }
    this.loading = true;
    const unitP = <Customer> this.fboForm.value;
    (unitP._id ? this.customerService.update(unitP) : this.customerService.save(unitP)).subscribe((unitC) => {

      this.toastr.success(`Customer ${unitC.name} is saved successfully`, 'Customer saved');
      this.goToCustomers();

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving customer ${unitP.name}`, 'Customer not saved');
      console.error(error);

    });

  }

}
