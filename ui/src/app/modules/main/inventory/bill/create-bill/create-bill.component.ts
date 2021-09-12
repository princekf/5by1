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
import { goToPreviousPage as _goToPreviousPage, fboTableRowExpandAnimation } from '@fboutil/fbo.util';
import { UnitService } from '@fboservices/inventory/unit.service';
import { Unit } from '@shared/entity/inventory/unit';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: [ './create-bill.component.scss', '../../../../../util/styles/fbo-form-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class CreateBillComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Bills';

  loading = true;

  ismatch = true;

  vendors: Array<Vendor> = [];

  units: Array<Unit> = [];

  products: Array<Product> = [];


  fboForm: FormGroup;

  dynamicRows: number[] = [];

  displayedColumns: string[] = [ 'product', 'unitPrice', 'unit', 'quantity', 'discount', 'totalAmount', 'totalTax', 'batchNumber', 'expiryDate', 'mfgDate', 'mrp', 'rrp' ];


  dataSource = new MatTableDataSource<AbstractControl>();


  myControl = new FormControl();

  filteredOptions: Observable<Product>;


  productsFiltered: Array<Product>;


  // eslint-disable-next-line max-params
  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly billService: BillService,
    private readonly productService: ProductService,
    private readonly vendorService: VendorService,
    private readonly unitService: UnitService,
    private readonly toastr: ToastrService,
    private fb: FormBuilder) {

    this.fboForm = this.fb.group({
      payedOvertime: [ false, Validators.required ],

    });

  }


  private createSaleItemForm = (): FormGroup => {

    const product = this.fBuilder.control('');
    product.valueChanges.subscribe((value) => {

      this.productService.list({ where: {name: {like: value,
        options: 'i'}} }).subscribe((productsP) => (this.productsFiltered = productsP.items));

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

      vendor: new FormControl('', [ Validators.required ]),

      billDate: this.fBuilder.control('', [ Validators.required ]),

      dueDate: this.fBuilder.control('', [ Validators.required ]),

      billNumber: this.fBuilder.control('', [ Validators.required ]),

      orderNumber: this.fBuilder.control('', [ Validators.required ]),

      orderDate: this.fBuilder.control('', [ Validators.required ]),

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
    this.unitService.listAll().subscribe((units) => {

      this.units = units;

    });
    this.productService.listAll().subscribe((products) => {

      this.products = products;

    });
    this.vendorService.listAll().subscribe((vendors) => {

      this.vendors = vendors;
      if (tId) {

        this.loading = true;
        this.billService.get(tId).subscribe((itemC) => {


          this.fboForm.setValue({
            id: itemC.id,
            vendor: itemC.vendor ?? '',
            billDate: itemC.billDate ?? '',
            dueDate: itemC.dueDate ?? '',
            billNumber: itemC.billNumber ?? '',
            orderNumber: itemC.orderNumber ?? '',
            orderDate: itemC.orderDate ?? '',
            totalAmount: itemC.totalAmount ?? '',
            totalDisount: itemC.totalDisount ?? '',
            totalTax: itemC.totalTax ?? '',
            grandTotal: itemC.grandTotal ?? '',
            isPaid: itemC.isPaid ?? '',
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

  upsertBill(): void {

    if (!this.fboForm.valid) {

      return;


    }
    this.loading = true;
    const itemP = <Bill> this.fboForm.value;
    (itemP.id ? this.billService.update(itemP) : this.billService.save(itemP)).subscribe((itemC) => {

      this.toastr.success(`Bill ${itemC.billNumber} is saved successfully`, 'Bill saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Bill ${itemP.billNumber}`, 'Bill not saved');
      console.error(error);

    });

  }

  extractNameOfProduct = (prod: Product): string => prod.name;

  HandleProductSelect = (_prod: Product, pos: number): void => {

    const itemsFormArray = <FormArray> this.fboForm.get('items');

    const formControl = itemsFormArray.get([ pos ]);
    formControl.get('quantity').setValue(1);


  }


  addNew(event) {

    const formArray = this.fboForm.get('items') as FormArray;
    formArray.controls.values = null;
    this.dataSource = new MatTableDataSource(formArray.controls);
    this.dynamicRows.push(this.dynamicRows.length);


  }

}
