import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { Customer } from '@shared/entity/inventory/customer';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: [ './create-customer.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateCustomerComponent implements OnInit {


  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Customers';

  loading = false;

  statesOptions: Observable<string[]>;

  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl(''),
    mobile: new FormControl(''),
    state: new FormControl(''),
    address: new FormControl(''),
    gstNo: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly customerService:CustomerService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    this.statesOptions = this.fboForm.controls.state.valueChanges
      .pipe(flatMap((nameQ) => this.customerService.distinct('state', { where: {state: {like: nameQ,
        options: 'i'}}})))
      .pipe(map((distinctResp) => distinctResp.data));

    const tId = this.route.snapshot.queryParamMap.get('id');
    if (tId) {

      this.formHeader = 'Update Customers';
      this.loading = true;
      this.customerService.get(tId, {}).subscribe((itemC) => {

        this.fboForm.setValue({id: itemC.id,
          name: itemC.name,
          email: itemC.email,
          mobile: itemC.mobile,
          state: itemC.state,
          address: itemC.address,
          gstNo: itemC.gstNo, });

        this.loading = false;

      });

    }

  }

  upsertCustomer(): void {

    if (!this.fboForm.valid) {

      return;

    }
    this.loading = true;
    const itemP = <Customer> this.fboForm.value;
    this.customerService.upsert(itemP).subscribe(() => {

      this.toastr.success(`Customer ${itemP.name} is saved successfully`, 'Customer saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving customer ${itemP.name}`, 'Customer not saved');
      console.error(error);

    });

  }

}
