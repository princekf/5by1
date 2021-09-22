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
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';


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

  units: Array<Unit> = [];

  products: Array<Product> = [];

  vendorsFiltered: Array<Vendor> = [];

  productsFiltered: Array<Product> = [];

  fboForm: FormGroup;

  displayedColumns: string[] = [ 'product', 'unitPrice', 'quantity', 'discount', 'totalAmount', 'batchNumber', 'expiryDate', 'mfgDate', 'mrp', 'rrp' ];

  dataSource = new MatTableDataSource<AbstractControl>();

  myControl = new FormControl();

  filteredOptions: Observable<Product[]>;

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly billService: BillService,
    private readonly productService: ProductService,
    private readonly vendorService: VendorService,
    private readonly unitService: UnitService,
    private readonly categoryService: CategoryService,
    private readonly toastr: ToastrService) { }


    private initValueChanges = () => {

      this.fboForm.controls.vendor.valueChanges.subscribe((vendorQ:unknown) => {

        if (typeof vendorQ !== 'string') {

          return;

        }
        this.vendorService.search({ where: {name: {like: vendorQ,
          options: 'i'}} })
          .subscribe((vendors) => (this.vendorsFiltered = vendors));

      });

    };

  private createSalteItemFormGroup = (): FormGroup => {

    const product = this.fBuilder.control('', [ Validators.required ]);
    const unitPrice = this.fBuilder.control(0, [ Validators.required ]);
    const unit = this.fBuilder.control('', [ Validators.required ]);
    const quantity = this.fBuilder.control(1, [ Validators.required ]);
    const discount = this.fBuilder.control(0, [ Validators.required ]);
    const totalAmount = this.fBuilder.control(0, [ Validators.required ]);
    const mrp = this.fBuilder.control(0, [ Validators.required ]);
    const rrp = this.fBuilder.control(0, [ Validators.required ]);

    return this.fBuilder.group({
      product,
      unitPrice,
      unit,
      quantity,
      discount,
      totalTax: this.fBuilder.control(0, [ Validators.required ]),
      totalAmount,
      batchNumber: this.fBuilder.control(''),
      expiryDate: this.fBuilder.control(''),
      mfgDate: this.fBuilder.control(''),
      mrp,
      rrp,
    });

  };

  private createSaleItemForm = (): FormGroup => {


    const fGrp = this.createSalteItemFormGroup();
    const {product, quantity, discount, unitPrice, totalAmount, unit, mrp, rrp} = fGrp.controls;
    const updateValueChanges = () => {

      const qty:number = quantity.value;
      const dct:number = discount.value;
      const uPrice:number = unitPrice.value;
      const totalAmt = uPrice * qty - dct;
      totalAmount.setValue(totalAmt);

      const formArray = this.fboForm.get('purchaseItems') as FormArray;
      let pAmount = 0;
      let pDiscount = 0;
      let pGTotal = 0;
      for (let idx = 0; idx < formArray.length; idx++) {

        const curFormGroup = formArray.get([ idx ]) as FormGroup;
        pAmount += curFormGroup.controls.quantity.value * curFormGroup.controls.unitPrice.value;
        pDiscount += curFormGroup.controls.discount.value;
        pGTotal += curFormGroup.controls.totalAmount.value;

      }

      this.fboForm.get('totalAmount').setValue(pAmount);
      this.fboForm.get('totalDiscount').setValue(pDiscount);
      this.fboForm.get('grandTotal').setValue(pGTotal);

    };
    product.valueChanges.subscribe((value) => {

      if (typeof value === 'object') {

        const sProduct = value as Product;
        this.categoryService.get(sProduct.categoryId, {include: [ {relation: 'unit'} ]}).subscribe((categoryS) => {

          unit.setValue(categoryS.unit);

        });

        unitPrice.valueChanges.subscribe(updateValueChanges);
        quantity.valueChanges.subscribe(updateValueChanges);
        discount.valueChanges.subscribe(updateValueChanges);

        mrp.valueChanges.subscribe((mrpV) => {

          rrp.setValue(mrpV);

        });

        const formArray = this.fboForm.get('purchaseItems') as FormArray;
        const lastFormGroup = formArray.get([ formArray.length - 1 ]) as FormGroup;
        if (lastFormGroup.controls.product.value) {

          formArray.push(this.createSaleItemForm());
          this.dataSource = new MatTableDataSource(formArray.controls);

        }
        return;

      }


      this.productService.list({ where: {name: {like: value,
        options: 'i'}}, }).subscribe((productsP) => (this.productsFiltered = productsP.items));

    });

    return fGrp;

  }


  private initFboForm = () => {

    this.fboForm = this.fBuilder.group({
      id: new FormControl(null),
      vendor: new FormControl('', [ Validators.required ]),
      billDate: this.fBuilder.control(new Date(), [ Validators.required ]),
      dueDate: this.fBuilder.control(null),
      billNumber: this.fBuilder.control('', [ Validators.required ]),
      orderNumber: this.fBuilder.control(''),
      orderDate: this.fBuilder.control(null),
      totalAmount: this.fBuilder.control(0, [ Validators.required ]),
      totalDiscount: this.fBuilder.control(0),
      totalTax: this.fBuilder.control(0, [ Validators.required ]),
      grandTotal: this.fBuilder.control(0, [ Validators.required ]),
      isPaid: this.fBuilder.control(true),
      purchaseItems: this.fBuilder.array([
        this.createSaleItemForm(),
      ])
    });

  };

  ngOnInit(): void {

    this.initFboForm();

    this.initValueChanges();

    const formArray = this.fboForm.get('purchaseItems') as FormArray;
    this.dataSource = new MatTableDataSource(formArray.controls);
    const formAArray = this.fboFForm.get('items') as FormArray;
    this.DataSource = new MatTableDataSource(formAArray.controls);

    const tId = this.route.snapshot.queryParamMap.get('id');
    if (tId) {

      this.formHeader = 'Update Bills';

    }
    if (tId) {

      this.loading = true;
      const queryParam:QueryData = {
        include: [
          {relation: 'vendor'}, {relation: 'purchaseItems.product'}
        ]
      };
      this.billService.get(tId, queryParam).subscribe((itemC) => {


        this.fboForm.setValue({
          id: itemC.id,
          vendor: itemC.vendor ?? '',
          billDate: itemC.billDate ?? '',
          dueDate: itemC.dueDate ?? '',
          billNumber: itemC.billNumber ?? '',
          orderNumber: itemC.orderNumber ?? '',
          orderDate: itemC.orderDate ?? '',
          totalAmount: itemC.totalAmount ?? '',
          totalDiscount: itemC.totalDiscount ?? '',
          totalTax: itemC.totalTax ?? '',
          grandTotal: itemC.grandTotal ?? '',
          isPaid: itemC.isPaid ?? false,
          puchaseItems: itemC.purchaseItems ?? ''
        });


        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertBill(): void {

    const itemsFormArray = <FormArray> this.fboForm.get('purchaseItems');
    for (let idx = itemsFormArray.length - 1; idx >= 0; idx--) {

      const curFgr = itemsFormArray.get([ idx ]) as FormGroup;
      if (!curFgr.controls.product.value) {

        itemsFormArray.removeAt(idx);

      }

    }
    if (!this.fboForm.valid) {

      return;


    }
    this.loading = true;
    const billP = <Bill> this.fboForm.value;
    this.billService.upsert(billP).subscribe(() => {

      this.toastr.success(`Bill ${billP.billNumber} is saved successfully`, 'Bill saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Bill ${billP.billNumber}`, 'Bill not saved');
      console.error(error);

    });

  }

 findUnitCode = (elm:FormGroup):string => elm.controls?.unit?.value?.code;

}

