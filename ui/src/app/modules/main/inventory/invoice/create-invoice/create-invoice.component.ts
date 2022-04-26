import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { Invoice, SaleItem } from '@shared/entity/inventory/invoice';
import { Customer } from '@shared/entity/inventory/customer';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '@shared/entity/inventory/product';
import { ProductService } from '@fboservices/inventory/product.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { StockService } from '@fboservices/inventory/stock.service';
import { forkJoin, throwError } from 'rxjs';
import { UnitService } from '@fboservices/inventory/unit.service';
import { CategoryService } from '@fboservices/inventory/category.service';
import { QueryData } from '@shared/util/query-data';

import { map, catchError } from 'rxjs/internal/operators';
import { Unit } from '@shared/entity/inventory/unit';
import { Bank } from '@shared/entity/inventory/bank';
import { BankService } from '@fboservices/inventory/bank.service';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: [ './create-invoice.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateInvoiceComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Invoices';

  loading = true;

  iserror = false;


  productsFiltered: Array<Product> = [];

  bankFiltered: Array<Bank> = [];

  fboForm: FormGroup;

  displayedColumns: string[] = [ 'product', 'unitPrice', 'quantity', 'discount', 'totalAmount', 'batchNumber', 'expiryDate', 'mfgDate', 'mrp', 'rrp', 'action' ];

  dataSource = new MatTableDataSource<AbstractControl>();


 customerFiltered: Array<Customer> = [];


 constructor(public readonly router: Router,
  public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly invoiceService:InvoiceService,
    private readonly productService:ProductService,
    private readonly categoryService:CategoryService,
    private readonly customerService:CustomerService,
    private readonly stockService: StockService,
    private readonly toastr: ToastrService,
    private readonly unitService: UnitService,
    private readonly bankService: BankService,) { }

    private initValueChanges = () => {

      this.fboForm.controls.customer.valueChanges.subscribe((customerQ:unknown) => {

        if (typeof customerQ !== 'string') {

          return;

        }
        this.customerService.search({ where: {name: {like: customerQ,
          options: 'i'}} })
          .subscribe((customers) => (this.customerFiltered = customers));

      });

    };

    private createSaleItemFormGroup = (sItem?: SaleItem): FormGroup => {

      const product = this.fBuilder.control(sItem?.product ?? '', [ Validators.required ]);
      const unitPrice = this.fBuilder.control(sItem?.unitPrice ?? 0, [ Validators.required ]);
      const unit = this.fBuilder.control(sItem?.unit ?? '', [ Validators.required ]);
      const quantity = this.fBuilder.control(sItem?.quantity ?? 1, [ Validators.required ]);
      const discount = this.fBuilder.control(sItem?.discount ?? 0, [ Validators.required ]);
      const totalAmount = this.fBuilder.control(sItem?.totalAmount ?? 0, [ Validators.required ]);
      const mrp = this.fBuilder.control(sItem?.mrp ?? 0, [ Validators.required ]);
      const rrp = this.fBuilder.control(sItem?.rrp ?? 0, [ Validators.required ]);

      const updateValueChanges = () => {

        if (typeof product.value === 'object') {

          const qty:number = quantity.value;
          const dct:number = discount.value;
          const uPrice:number = unitPrice.value;
          const totalAmt = uPrice * qty - dct;
          totalAmount.setValue(totalAmt);

          const formArray = this.fboForm.get('saleItems') as FormArray;
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

        }

      };


      unitPrice.valueChanges.subscribe(updateValueChanges);
      quantity.valueChanges.subscribe(updateValueChanges);
      discount.valueChanges.subscribe(updateValueChanges);
      mrp.valueChanges.subscribe((mrpV) => rrp.setValue(mrpV));

      return this.fBuilder.group({
        product,
        unitPrice,
        unit,
        quantity,
        discount,
        totalTax: this.fBuilder.control(sItem?.totalTax ?? 0, [ Validators.required ]),
        totalAmount,
        batchNumber: this.fBuilder.control(sItem?.batchNumber ?? ''),
        expiryDate: this.fBuilder.control(sItem?.expiryDate ?? ''),
        mfgDate: this.fBuilder.control(sItem?.mfgDate ?? ''),
        mrp,
        rrp
      });

    }

    private createSaleItemForm = (saleItem?: SaleItem): FormGroup => {

      const fGrp = this.createSaleItemFormGroup(saleItem);
      const {product, unit, unitPrice, mrp, batchNumber} = fGrp.controls;
      product.valueChanges.subscribe((value) => {

        if (typeof value === 'object') {

          const sProduct = value as Product;
          this.categoryService.get(sProduct.categoryId, {include: [ {relation: 'unit'} ]}).subscribe((categoryS) => unit.setValue(categoryS.unit));
          this.stockService.stockSummary(sProduct.id).subscribe((stockSummarys) => {

            if (stockSummarys.length < 1) {

              return;

            }
            const [ stockSummary ] = stockSummarys;
            unitPrice.setValue(stockSummary.rrp);
            mrp.setValue(stockSummary.mrp);
            batchNumber.setValue(stockSummary.batchNumber);

          });
          const formArray = this.fboForm.get('saleItems') as FormArray;
          const lastFormGroup = formArray.get([ formArray.length - 1 ]) as FormGroup;
          if (lastFormGroup.controls.product.value) {

            formArray.push(this.createSaleItemForm());
            this.dataSource = new MatTableDataSource(formArray.controls);
            this.createSaleItemFormGroup().reset();

          }
          this.iserror = true;
          return;

        }


        this.productService.list({ where: {name: {like: value,
          options: 'i'}}, }).subscribe((productsP) => (this.productsFiltered = productsP.items));

      });

      return fGrp;

    };

    private initFboForm = () => {

      this.fboForm = this.fBuilder.group({
        id: new FormControl(null),
        customer: new FormControl('', [ Validators.required ]),
        invoiceDate: this.fBuilder.control(new Date(), [ Validators.required ]),
        dueDate: this.fBuilder.control(''),
        invoiceNumber: this.fBuilder.control('', [ Validators.required ]),
        totalAmount: this.fBuilder.control(0, [ Validators.required ]),
        totalDiscount: this.fBuilder.control(0),
        totalTax: this.fBuilder.control(0, [ Validators.required ]),
        roundOff: this.fBuilder.control(0),
        grandTotal: this.fBuilder.control(0, [ Validators.required ]),
        isReceived: this.fBuilder.control(true, [ Validators.required ]),
        bank: this.fBuilder.control('', [ Validators.required ],),
        saleItems: this.fBuilder.array([
          this.createSaleItemForm(),
        ])
      });

    };


    private setBillFormValues(itemC: Invoice, formArray: FormArray) {

      this.fboForm.controls.id.setValue(itemC.id ?? '');
      this.fboForm.controls.customer.setValue(itemC.customer ?? '');
      this.fboForm.controls.invoiceDate.setValue(itemC.invoiceDate ?? new Date());
      this.fboForm.controls.dueDate.setValue(itemC.dueDate ?? '');
      this.fboForm.controls.invoiceNumber.setValue(itemC.invoiceNumber ?? '');
      this.fboForm.controls.totalAmount.setValue(itemC.totalAmount ?? 0);
      this.fboForm.controls.totalDiscount.setValue(itemC.totalDiscount ?? 0);
      this.fboForm.controls.totalTax.setValue(itemC.totalTax ?? 0);
      this.fboForm.controls.grandTotal.setValue(itemC.grandTotal ?? 0);
      this.fboForm.controls.roundOff.setValue(itemC.roundOff ?? 0);
      this.fboForm.controls.isReceived.setValue(itemC.isReceived ?? true);

      formArray.removeAt(0);
      for (const pItem of itemC.saleItems) {

        formArray.push(this.createSaleItemForm(pItem));

      }
      formArray.push(this.createSaleItemForm());

    }

    private fillProductAndUnit(itemC: Invoice):void {

      const pIds:Array<string> = [];
      const uIds:Array<string> = [];
      for (const pItem of itemC.saleItems) {

        pIds.push(pItem.productId);
        uIds.push(pItem.unitId);

      }
      const queryDataP:QueryData = {
        where: {
          id: {
            inq: pIds
          }
        }
      };
      const findProductsP$ = this.productService.search(queryDataP);
      const queryDataU:QueryData = {
        where: {
          id: {
            inq: uIds
          }
        }
      };
      const findUnitsU$ = this.unitService.search(queryDataU);
      forkJoin([ findProductsP$, findUnitsU$ ]).pipe(
        catchError((err) => throwError(err))
      )
        .pipe(
          map(([ productsP, unitsP ]) => {

            const products:Record<string, Product> = {};
            const units:Record<string, Unit> = {};
            productsP.forEach((prod) => (products[prod.id] = prod));
            unitsP.forEach((unt) => (units[unt.id] = unt));
            return {products,
              units};

          })
        )
        .subscribe((res) => {

          itemC.saleItems.forEach((pItemT) => {

            pItemT.product = res.products[pItemT.productId];
            pItemT.unit = res.units[pItemT.unitId];

          });
          const formArray = this.fboForm.get('saleItems') as FormArray;
          this.setBillFormValues(itemC, formArray);
          this.dataSource = new MatTableDataSource(formArray.controls);
          this.loading = false;

        });

    }


    ngOnInit(): void {

      this.bankService.search({}).subscribe((banks) => {

        this.bankFiltered = banks;

        const defaultBank = banks.find((bankName) => bankName.name === banks[0].name);

        this.fboForm.get('bank').setValue(defaultBank.name);


      });


      this.initFboForm();
      this.initValueChanges();
      const formArray = this.fboForm.get('saleItems') as FormArray;
      this.dataSource = new MatTableDataSource(formArray.controls);

      const tId = this.route.snapshot.queryParamMap.get('id');
      if (tId) {

        this.formHeader = 'Update Invoices';
        this.loading = true;
        const queryParam:QueryData = {
          include: [
            {relation: 'customer'}
          ]
        };
        this.invoiceService.get(tId, queryParam).subscribe((itemC) => this.fillProductAndUnit(itemC));

      } else {

        this.loading = false;

      }


    }

    saveWithBank(event):void {

      if (event.value === 'notRecieved') {

        this.fboForm.get('isReceived').setValue(false);

        if (this.fboForm.controls.isReceived.value === false) {

          const itemssFormArray = <FormArray> this.fboForm.get('bank');
          itemssFormArray.disable();


        }

      } else {

        this.fboForm.get('isReceived').setValue(true);

      }


    }

    extractNameOfObject = (obj: {name: string}): string => obj.name;

    findUnitCode = (elm:FormGroup):string => elm.controls?.unit?.value?.code;

    upsertInvoice(): void {

      const itemsFormArray = <FormArray> this.fboForm.get('saleItems');
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

      const invoiceP = <Invoice> this.fboForm.value;
      const idate = dayjs(invoiceP.invoiceDate).utc(true)
        .format();


      invoiceP.invoiceDate = new Date(idate);
      const ivdate = dayjs(invoiceP.dueDate).utc(true)
        .format();


      invoiceP.dueDate = new Date(ivdate);
      this.invoiceService.upsert(invoiceP).subscribe(() => {

        this.toastr.success(`Invoice ${invoiceP.invoiceNumber} is saved successfully`, 'Invoice saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        this.loading = false;
        this.toastr.error(`Error in saving Invoice ${invoiceP.invoiceNumber}`, 'Invoice not saved');
        console.error(error);

      });

    }

    removeAt= (idx:number): void => {


      const itemsFormArray = <FormArray> this.fboForm.get('saleItems');


      const curFgr = itemsFormArray.get([ idx ]) as FormGroup;

      if (curFgr.controls.product.value) {

        if (typeof curFgr.controls.product.value !== 'object') {

          curFgr.get('product').setValue('');

          this.createSaleItemFormGroup().reset();
          this.createSaleItemForm();

        } else {

          const {data} = this.dataSource;
          data.splice(idx, 1);
          this.dataSource.data = data;

          itemsFormArray.updateValueAndValidity();
          this.fboForm.updateValueAndValidity();

          this.createSaleItemFormGroup().reset();

        }

      }

    }

}
