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

  revenues: Array<Revenue> = [];

  banks: Array<Bank> = [];

  customers: Array<Customer> =[];

  invoices: Array<Invoice> =[];

  form: FormGroup = new FormGroup({

    _id: new FormControl(null),

    receivedDate: new FormControl('', [ Validators.required ]),

    customer: new FormControl('', [ Validators.required ]),

    invoice: new FormControl('', [ Validators.required ]),

    bank: new FormControl('', [ Validators.required ]),

    category: new FormControl('', [ Validators.required ]),

    amount: new FormControl('', [ Validators.required ]),

    description: new FormControl('', [ Validators.required ]),

  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly revenueService: RevenueService,
    private readonly toastr: ToastrService,
    private readonly bankService: BankService,
    private readonly customerService: CustomerService,
    private readonly invoiceService: InvoiceService,
  ) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');

    this.bankService.listAll().subscribe((banks) => {

      this.banks = banks;


    });

    this.customerService.listAll().subscribe((customers) => {

      this.customers = customers;


    });


    this.invoiceService.list(this.queryParams).subscribe((invoices) => {

      this.invoices = invoices.items;


    });

    this.revenueService.listAll().subscribe((revenues) => {

      this.revenues = revenues;

      this.loading = false;
      if (tId) {


        this.formHeader = 'Update Revenue';
        this.loading = true;
        this.revenueService.get(tId).subscribe((revenueC) => {

          this.form.setValue({
            _id: revenueC._id ?? '',
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

    });

  }


  upsertRevenue(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const revenueP = <Revenue> this.form.value;


    // eslint-disable-next-line max-len
    (revenueP._id ? this.revenueService.update(revenueP) : this.revenueService.save(revenueP)).subscribe((revenueC) => {

      this.toastr.success(`Revenue ${revenueC.receivedDate} is saved successfully`, 'Revenue saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Revenue ${revenueP.receivedDate}`, 'Revenue not saved');
      console.error(error);

    });

  }

}
