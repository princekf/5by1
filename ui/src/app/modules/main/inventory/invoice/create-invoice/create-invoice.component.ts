import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { SaleItem } from '@shared/entity/inventory/invoice';
import { Customer } from '@shared/entity/inventory/customer';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '@shared/entity/inventory/product';
import { ProductService } from '@fboservices/inventory/product.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { StockService } from '@fboservices/inventory/stock.service';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { CategoryService } from '@fboservices/inventory/category.service';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: [ './create-invoice.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateInvoiceComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Invoices';

  loading = true;

  fboForm: FormGroup;

  displayedColumns: string[] = [ 'product', 'mrp', 'quantity', 'unitPrice', 'discount', 'totalAmount', 'batchNumber' ];

 dataSource = new MatTableDataSource<AbstractControl>();

 customers$: Observable<Array<Customer>>;

 productsFiltered: Array<Product> = [];


 constructor(public readonly router: Router,
  public readonly route: ActivatedRoute,
    private readonly fBuilder: FormBuilder,
    private readonly invoiceService:InvoiceService,
    private readonly productService:ProductService,
    private readonly categoryService:CategoryService,
    private readonly customerService:CustomerService,
    private readonly stockService: StockService,
    private readonly toastr: ToastrService,
    private fb: FormBuilder) { }

    private initValueChanges = () => {

      this.customers$ = this.fboForm.controls.customer.valueChanges
        .pipe(flatMap((customerQ) => {

          if (typeof customerQ !== 'string') {

            return [];

          }
          return this.customerService.search({ where: {name: {like: customerQ,
            options: 'i'}} });

        }));

    };

    private createSaleItemFormGroup = (sItem?: SaleItem): FormGroup => {

      const product = this.fBuilder.control(sItem?.product ?? '', [ Validators.required ]);
      const unitPrice = this.fBuilder.control(sItem?.unitPrice ?? 0, [ Validators.required ]);
      const unit = this.fBuilder.control(sItem?.unit ?? '', [ Validators.required ]);
      const quantity = this.fBuilder.control(sItem?.quantity ?? 1, [ Validators.required ]);
      const discount = this.fBuilder.control(sItem?.discount ?? 0, [ Validators.required ]);
      const totalAmount = this.fBuilder.control(sItem?.totalAmount ?? 0, [ Validators.required ]);
      const mrp = this.fBuilder.control(sItem?.mrp ?? 0, [ Validators.required ]);
      // TODO here
      return this.fBuilder.group({
        product,
        unitPrice,
        unit,
        quantity,
        discount,
        totalTax: this.fBuilder.control(sItem?.totalTax ?? 0, [ Validators.required ]),
        totalAmount,
        batchNumber: this.fBuilder.control(sItem?.batchNumber ?? ''),
        mrp,
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

          }
          return;

        }


        this.productService.list({ where: {name: {like: value,
          options: 'i'}}, }).subscribe((productsP) => (this.productsFiltered = productsP.items));

      });
      // TODO here
      return fGrp;

    };

    private initFboForm = () => {

      this.fboForm = this.fBuilder.group({
        id: new FormControl(null),
        customer: new FormControl('', [ Validators.required ]),
        invoiceDate: this.fBuilder.control(new Date(), [ Validators.required ]),
        dueDate: this.fBuilder.control(''),
        invoiceNumber: this.fBuilder.control('', [ Validators.required ]),
        totalAmount: this.fBuilder.control('', [ Validators.required ]),
        totalDisount: this.fBuilder.control(''),
        totalTax: this.fBuilder.control(''),
        roundOff: this.fBuilder.control(''),
        grandTotal: this.fBuilder.control('', [ Validators.required ]),
        isReceived: this.fBuilder.control(true, [ Validators.required ]),
        saleItems: this.fBuilder.array([
          this.createSaleItemForm(),
        ])
      });

    };

    ngOnInit(): void {

      this.initFboForm();
      this.initValueChanges();
      const formArray = this.fboForm.get('saleItems') as FormArray;
      this.dataSource = new MatTableDataSource(formArray.controls);

      this.loading = false;

    }

    extractNameOfObject = (obj: {name: string}): string => obj.name;

    findUnitCode = (elm:FormGroup):string => elm.controls?.unit?.value?.code;

    upsertInvoice(): void {

    }

}
