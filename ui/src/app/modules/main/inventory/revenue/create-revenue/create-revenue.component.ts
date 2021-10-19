import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RevenueService } from '@fboservices/inventory/revenue.service';
import { Revenue } from '@shared/entity/inventory/revenue';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { Bank } from '@shared/entity/inventory/bank';
import { Invoice } from '@shared/entity/inventory/invoice';
import { Customer } from '@shared/entity/inventory/customer';
import { BankService } from '@fboservices/inventory/bank.service';
import { CustomerService } from '@fboservices/inventory/customer.service';
import { InvoiceService } from '@fboservices/inventory/invoice.service';
import { QueryData } from '@shared/util/query-data';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
@Component({
  selector: 'app-create-revenue',
  templateUrl: './create-revenue.component.html',
  styleUrls: [ './create-revenue.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateRevenueComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Revenue';


  queryParams:QueryData = { };

  customers$: Observable<Array<Customer>>;

  invoices$: Observable<Array<Invoice>>;

  banks$: Observable<Array<Bank>>;

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    receivedDate: new FormControl('', [ Validators.required ]),

    customer: new FormControl('', [ Validators.required ]),

    invoice: new FormControl(''),

    bank: new FormControl('', [ Validators.required ]),

    category: new FormControl(''),

    amount: new FormControl('', [ Validators.required ]),

    description: new FormControl(''),

  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly revenueService: RevenueService,
    private readonly toastr: ToastrService,
    private readonly bankService: BankService,
    private readonly customerService: CustomerService,
    private readonly invoiceService: InvoiceService,
  ) { }

  private initValueChanges = () => {

    this.customers$ = this.form.controls.customer.valueChanges
      .pipe(flatMap((vendorQ) => {

        if (typeof vendorQ !== 'string') {

          return [];

        }
        return this.customerService.search({ where: {name: {like: vendorQ,
          options: 'i'}} });

      }));

    this.invoices$ = this.form.controls.invoice.valueChanges
      .pipe(flatMap((billQ) => {

        if (typeof billQ !== 'string') {

          return [];

        }
        return this.invoiceService.search({ where: {invoiceNumber: {like: billQ,
          options: 'i'}} });

      }));

    this.banks$ = this.form.controls.bank.valueChanges
      .pipe(flatMap((bankQ) => {

        if (typeof bankQ !== 'string') {

          return [];

        }
        return this.bankService.search({ where: {name: {like: bankQ,
          options: 'i'}} });

      }));

  };

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');

    this.loading = false;
    if (tId) {


      this.formHeader = 'Update Revenue';
      this.loading = true;
      const queryParam:QueryData = {
        include: [
          {relation: 'customer'}, {relation: 'invoice'}, {relation: 'bank'}
        ]
      };
      this.revenueService.get(tId, queryParam).subscribe((revenueC) => {

        this.form.setValue({
          id: revenueC.id ?? '',
          receivedDate: revenueC.receivedDate ?? '',
          customer: revenueC.customer ?? '',
          invoice: revenueC.invoice ?? '',
          bank: revenueC.bank ?? '',
          category: revenueC.category ?? '',
          amount: revenueC.amount ?? '',
          description: revenueC.description ?? ''
        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  extractInvoiceNumber = (obj: Invoice): string => obj.invoiceNumber;

  upsertRevenue(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const revenueP = <Revenue> this.form.value;


    this.revenueService.upsert(revenueP).subscribe(() => {

      this.toastr.success(`Revenue ${revenueP.amount} is saved successfully`, 'Revenue saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Revenue ${revenueP.receivedDate}`, 'Revenue not saved');
      console.error(error);

    });

  }

}
