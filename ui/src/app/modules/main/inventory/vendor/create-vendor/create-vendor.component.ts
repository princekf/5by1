import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Vendor } from '@shared/entity/inventory/vendor';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: [ './create-vendor.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateVendorComponent {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Vendors';

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

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly vendorService:VendorService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    this.statesOptions = this.fboForm.controls.state.valueChanges.pipe(
      startWith(''), map((value) => this._filter(value))
    );
    this.vendorService.getStates().subscribe((states) => {

      this.states = states;

    });

    const tId = this.route.snapshot.queryParamMap.get('id');
    if (tId) {

      this.formHeader = 'Update Vendors';
      this.loading = true;
      this.vendorService.get(tId).subscribe((itemC) => {

        this.fboForm.setValue({_id: itemC._id,
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
    const itemP = <Vendor> this.fboForm.value;
    (itemP._id ? this.vendorService.update(itemP) : this.vendorService.save(itemP)).subscribe((itemC) => {

      this.toastr.success(`Vendor ${itemC.name} is saved successfully`, 'Vendor saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving vendor ${itemP.name}`, 'Vendor not saved');
      console.error(error);

    });

  }

}
