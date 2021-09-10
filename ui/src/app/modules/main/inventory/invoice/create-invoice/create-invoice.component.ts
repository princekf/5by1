import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '@shared/entity/inventory/invoice';
import { Customer } from '@shared/entity/inventory/customer';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '@shared/entity/inventory/product';
import { ProductService } from '@fboservices/inventory/product.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { UnitService } from '@fboservices/inventory/unit.service';
import { Unit } from '@shared/entity/inventory/unit';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: [ './create-invoice.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateInvoiceComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Invoices';

  loading = true;

  customers: Array<Customer> = [];

  units: Array<Unit> = [];

  products: Array<Product> = [];

  dynamicRows: number[] = [];

  fboForm: FormGroup;

  displayedColumns: string[] = [ 'product', 'quantity', 'unitPrice', 'unit', 'discount', 'totalAmount', 'totalTax', 'batchNumber', 'expiryDate', 'mfgDate', 'mrp', 'rrp' ];

 dataSource = new MatTableDataSource<AbstractControl>();

 productsFiltered: Array<Product>;

 filteredOptions: Observable<Product>;


 // eslint-disable-next-line max-params
 constructor(public readonly router: Router,
  public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly invoiceService:InvoiceService,
    private readonly productService:ProductService,
    private readonly customerService:CustomerService,
    private readonly unitService: UnitService,
    private readonly toastr: ToastrService,
    private fb: FormBuilder) {

   this.fboForm = this.fb.group({
     payedOvertime: [ false, Validators.required ],

   });

 }


    private createSaleItemForm = ():FormGroup => {

      const product = this.fBuilder.control('');
      product.valueChanges.subscribe((value) => {

        this.productService.list({qrs: value}).subscribe((productsP) => (this.productsFiltered = productsP.items));

      });
      return this.fBuilder.group({
        product: this.fBuilder.control('', [ Validators.required ]),

        unitPrice: this.fBuilder.control('', [ Validators.required ]),

        unit: this.fBuilder.control('', [ Validators.required ]),

        quantity: this.fBuilder.control('', [ Validators.required ]),

        discount: this.fBuilder.control('', [ Validators.required ]),

        totalTax: this.fBuilder.control('', [ Validators.required ]),

        totalAmount: this.fBuilder.control('', [ Validators.required ]),

        batchNumber: this.fBuilder.control('', [ Validators.required ]),

        expiryDate: this.fBuilder.control('', [ Validators.required ]),

        mfgDate: this.fBuilder.control('', [ Validators.required ]),

        mrp: this.fBuilder.control('', [ Validators.required ]),

        rrp: this.fBuilder.control('', [ Validators.required ]),

      });

    }

    // eslint-disable-next-line max-lines-per-function
    ngOnInit(): void {

      this.fboForm = this.fBuilder.group({
        id: new FormControl(null),

        customer: new FormControl('', [ Validators.required ]),

        invoiceDate: this.fBuilder.control('', [ Validators.required ]),

        dueDate: this.fBuilder.control('', [ Validators.required ]),

        invoiceNumber: this.fBuilder.control('', [ Validators.required ]),

        totalAmount: this.fBuilder.control('', [ Validators.required ]),

        totalDisount: this.fBuilder.control('', [ Validators.required ]),

        totalTax: this.fBuilder.control('', [ Validators.required ]),

        roundOff: this.fBuilder.control('', [ Validators.required ]),

        grandTotal: this.fBuilder.control('', [ Validators.required ]),

        isReceived: this.fBuilder.control('', [ Validators.required ]),

        items: this.fBuilder.array([
          this.createSaleItemForm(),
        ])
      });

      const formArray = this.fboForm.get('items') as FormArray;
      this.dataSource = new MatTableDataSource(formArray.controls);

      const tId = this.route.snapshot.queryParamMap.get('id');
      if (tId) {

        this.formHeader = 'Update Invoices';

      }
      this.unitService.listAll().subscribe((units) => {

        this.units = units;

      });

      this.productService.listAll().subscribe((products) => {

        this.products = products;

      });
      this.customerService.listAll().subscribe((customers) => {

        this.customers = customers;
        if (tId) {

          this.loading = true;
          this.invoiceService.get(tId).subscribe((itemC) => {

            /*
             * This.fboForm.setValue({id: itemC.id,
             *   Customer: itemC.customer ?? ''});
             * ItemC.items?.forEach((item) => {
             */

            /*
             *   Const control = new FormControl('', Validators.required);
             *   This.items.push(control);
             */

            // });


            this.fboForm.setValue({
              id: itemC.id,
              customer: itemC.customer ?? '',
              invoiceDate: itemC.invoiceDate ?? '',
              dueDate: itemC.dueDate ?? '',
              invoiceNumber: itemC.invoiceNumber ?? '',

              totalAmount: itemC.totalAmount ?? '',
              totalDisount: itemC.totalDisount ?? '',
              totalTax: itemC.totalTax ?? '',
              roundOff: itemC.roundOff ?? '',
              grandTotal: itemC.grandTotal ?? '',
              isReceived: itemC.isReceived ?? '',
              items: itemC.items ?? ''
            });


            this.loading = false;

          });

        } else {

          this.loading = false;

        }

      });

      this.dynamicRows.push(this.dynamicRows.length);

    }

    upsertInvoice(): void {

      if (!this.fboForm.valid) {

        return;

      }
      this.loading = true;
      const itemP = <Invoice> this.fboForm.value;
      (itemP.id ? this.invoiceService.update(itemP) : this.invoiceService.save(itemP)).subscribe((itemC) => {

        this.toastr.success(`Invoice ${itemC.invoiceNumber} is saved successfully`, 'Invoice saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving invoice ${itemP.invoiceNumber}`, 'Invoice not saved');
        console.error(error);

      });

    }

    extractNameOfProduct = (prod: Product): string => prod.name;

    handleProductSelect = (prod: Product, pos: number): void => {

      const itemsFormArray = <FormArray> this.fboForm.get('items');
      const formControl = itemsFormArray.get([ pos ]);
      formControl.get('quantity').setValue(1);

    }

    addNew() :void {

      this.dynamicRows.push(this.dynamicRows.length);

    }

}
