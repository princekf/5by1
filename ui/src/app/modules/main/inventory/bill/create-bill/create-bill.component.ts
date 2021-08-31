import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '@fboservices/inventory/bill.service';
import { ToastrService } from 'ngx-toastr';
import { Bill } from '@shared/entity/inventory/bill';
import { Vendor } from '@shared/entity/inventory/vendor';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '@shared/entity/inventory/product';
import { ProductService } from '@fboservices/inventory/product.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: [ './create-bill.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateBillComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Bills';

  loading = true;

  vendors: Array<Vendor> = [];

  fboForm: FormGroup;

  displayedColumns: string[] = [ 'product', 'quantity', 'unitPrice', 'discount', 'totalAmount' ];

 dataSource = new MatTableDataSource<AbstractControl>();

 productsFiltered: Array<Product>;


 constructor(public readonly router: Router,
  public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly billService:BillService,
    private readonly productService:ProductService,
    private readonly vendorService:VendorService,
    private readonly toastr: ToastrService) { }


    private createSaleItemForm = ():FormGroup => {

      const product = this.fBuilder.control('');
      product.valueChanges.subscribe((value) => {

        this.productService.list({qrs: value}).subscribe((productsP) => (this.productsFiltered = productsP.items));

      });
      return this.fBuilder.group({
        product,

        unitPrice: this.fBuilder.control(''),

        unit: this.fBuilder.control(''),

        quantity: this.fBuilder.control(''),

        discount: this.fBuilder.control(''),

        taxes: this.fBuilder.control(''),

        totalTax: this.fBuilder.control(''),

        totalAmount: this.fBuilder.control(''),

        batchNumber: this.fBuilder.control(''),

        expiryDate: this.fBuilder.control(''),

        mfgDate: this.fBuilder.control(''),

        mrp: this.fBuilder.control(''),

      });

    }


    ngOnInit(): void {

      this.fboForm = this.fBuilder.group({
        _id: new FormControl(null),

        vendor: new FormControl('', [ Validators.required ]),

        billDate: this.fBuilder.control('', [ Validators.required ]),

        billNumber: this.fBuilder.control('', [ Validators.required ]),

        totalAmount: this.fBuilder.control('', [ Validators.required ]),

        totalDisount: this.fBuilder.control('', [ Validators.required ]),

        totalTax: this.fBuilder.control('', [ Validators.required ]),

        grandTotal: this.fBuilder.control('', [ Validators.required ]),

        isPaid: this.fBuilder.control(''),

        items: this.fBuilder.array([
          this.createSaleItemForm(),
        ])
      });

      const formArray = this.fboForm.get('items') as FormArray;
      this.dataSource = new MatTableDataSource(formArray.controls);

      const tId = this.route.snapshot.queryParamMap.get('id');
      if (tId) {

        this.formHeader = 'Update Bills';

      }
      this.vendorService.listAll().subscribe((vendors) => {

        this.vendors = vendors;
        if (tId) {

          this.loading = true;
          this.billService.get(tId).subscribe((itemC) => {


            this.fboForm.setValue({_id: itemC._id,
              vendor: itemC.vendor ?? '',
              billDate: itemC.billDate ?? '',
              billNumber: itemC.billNumber ?? '',
              totalAmount: itemC.totalAmount ?? '',
              totalDisount: itemC.totalDisount ?? '',
              totalTax: itemC.totalTax ?? '',
              grandTotal: itemC.grandTotal ?? '',
              isPaid: itemC.isPaid ?? '',
              items: itemC.items });


            this.loading = false;

          });

        } else {

          this.loading = false;

        }

      });


    }


    upsertBill(): void {

      if (!this.fboForm.valid) {

        return;

      }
      this.loading = true;
      const itemP = <Bill> this.fboForm.value;
      (itemP._id ? this.billService.update(itemP) : this.billService.save(itemP)).subscribe((itemC) => {

        this.toastr.success(`Bill ${itemC.billNumber} is saved successfully`, 'Bill saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving Bill ${itemP.billNumber}`, 'Bill not saved');
        console.error(error);

      });

    }

    extractNameOfProduct = (prod: Product): string => prod.name;

    handleProductSelect = (prod: Product, pos: number): void => {

      const itemsFormArray = <FormArray> this.fboForm.get('items');
      const formControl = itemsFormArray.get([ pos ]);
      formControl.get('quantity').setValue(1);

    }

}
