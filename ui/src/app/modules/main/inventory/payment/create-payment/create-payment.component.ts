import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { BankService } from '@fboservices/inventory/bank.service';
import { BillService } from '@fboservices/inventory/bill.service';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { Payment } from '@shared/entity/inventory/payment';
import { Bank } from '@shared/entity/inventory/bank';
import { Bill } from '@shared/entity/inventory/bill';
import { Vendor } from '@shared/entity/inventory/vendor';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: [ './create-payment.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreatePaymentComponent {


  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Payments';

  queryParams:QueryData = { };

  payments: Array<Payment> = [];

  banks: Array<Bank> = [];

  bankFiltered: Array<Bank>;

  bills:Array<Bill> = [];

  billFiltered: Array<Bill>;

  vendors: Array<Vendor> = [];


  vendorFiltered: Array<Vendor>;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    paidDate: new FormControl('', [ Validators.required ]),
    vendor: new FormControl('', [ Validators.required ]),
    bill: new FormControl('', [ Validators.required ]),
    bank: new FormControl('', [ Validators.required ]),
    category: new FormControl('', [ Validators.required ]),
    amount: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
  });

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly paymentService:PaymentService,
    private readonly bankService:BankService,
    private readonly vendorService:VendorService,
    private readonly billService:BillService,
    private readonly toastr: ToastrService
  ) { }

  private initValueChanges = () => {

    this.form.controls.vendor.valueChanges.subscribe((categoryQ:unknown) => {

      if (typeof categoryQ !== 'string') {

        return;

      }
      this.vendorService.search({ where: {name: {like: categoryQ,
        options: 'i'}} })
        .subscribe((vendors) => (this.vendorFiltered = vendors));

    });

    this.form.controls.bank.valueChanges.subscribe((categoryQ:unknown) => {

      if (typeof categoryQ !== 'string') {

        return;

      }
      this.bankService.search({ where: {name: {like: categoryQ,
        options: 'i'}} })
        .subscribe((banks) => (this.bankFiltered = banks));

    });


  };

  extractNameOfObject = (obj: {name: string}): string => obj.name;


  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');

    this.bankService.search({}).subscribe((banks) => {

      this.banks = banks;

    });
    this.vendorService.search({}).subscribe((vendors) => {

      this.vendors = vendors;

    });
    this.billService.listAll().subscribe((bills) => {

      this.bills = bills;

    });

    this.paymentService.list(this.queryParams).subscribe((payments) => {

      this.payments = payments.items;
      this.loading = false;
      if (tId) {


        this.formHeader = 'Update Payments';
        this.loading = true;
        this.paymentService.get(tId).subscribe((paymentC) => {

          this.form.setValue({
            id: paymentC.id ?? '',
            paidDate: paymentC.paidDate ?? '',
            vendor: paymentC.vendor ?? '',
            bill: paymentC.bill ?? '',
            bank: paymentC.bank ?? '',
            category: paymentC.category ?? '',
            amount: paymentC.amount ?? '',
            description: paymentC.description ?? ''
          });

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    });

  }

  ngAfterViewInit():void {

    this.initValueChanges();

  }


  upsertPayment(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const paymentP = <Payment> this.form.value;


    // eslint-disable-next-line max-len
    (paymentP.id ? this.paymentService.update(paymentP) : this.paymentService.save(paymentP)).subscribe((paymentC) => {

      this.toastr.success(`Payment ${paymentC.paidDate} is saved successfully`, 'Payment saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Payment ${paymentP.paidDate}`, 'Payment not saved');
      console.error(error);

    });

  }

}
