import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '@fboservices/inventory/payment.service';
import { ToastrService } from 'ngx-toastr';
import { Payment } from '@shared/entity/inventory/payment';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { Observable } from 'rxjs';
import { Vendor } from '@shared/entity/inventory/vendor';
import { flatMap } from 'rxjs/operators';
import { VendorService } from '@fboservices/inventory/vendor.service';
import { Bill } from '@shared/entity/inventory/bill';
import { Bank } from '@shared/entity/inventory/bank';
import { BillService } from '@fboservices/inventory/bill.service';
import { BankService } from '@fboservices/inventory/bank.service';

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

  vendors$: Observable<Array<Vendor>>;

  bills$: Observable<Array<Bill>>;

  banks$: Observable<Array<Bank>>;


  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    paidDate: new FormControl(new Date(), [ Validators.required ]),
    vendor: new FormControl(''),
    bill: new FormControl(''),
    bank: new FormControl('', [ Validators.required ]),
    category: new FormControl(''),
    amount: new FormControl('', [ Validators.required ]),
    description: new FormControl(''),
  });

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly paymentService:PaymentService,
    private readonly vendorService: VendorService,
    private readonly billService: BillService,
    private readonly bankService: BankService,
    private readonly toastr: ToastrService
  ) { }

  private initValueChanges = () => {

    this.vendors$ = this.form.controls.vendor.valueChanges
      .pipe(flatMap((vendorQ) => {

        if (typeof vendorQ !== 'string') {

          return [];

        }
        return this.vendorService.search({ where: {name: {like: vendorQ,
          options: 'i'}} });

      }));

    this.bills$ = this.form.controls.bill.valueChanges
      .pipe(flatMap((billQ) => {

        if (typeof billQ !== 'string') {

          return [];

        }
        return this.billService.search({ where: {billNumber: {like: billQ,
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

  }

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');


    this.loading = false;
    if (tId) {


      this.formHeader = 'Update Payments';
      this.loading = true;
      const queryParam:QueryData = {
        include: [
          {relation: 'vendor'}, {relation: 'bill'}, {relation: 'bank'}
        ]
      };
      this.paymentService.get(tId, queryParam).subscribe((paymentC) => {

        this.form.setValue({
          id: paymentC.id ?? '',
          paidDate: paymentC.paidDate ?? new Date(),
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


  }

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  extractBillNumber = (obj: Bill): string => obj.billNumber;

  upsertPayment(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const paymentP = <Payment> this.form.value;

    this.paymentService.upsert(paymentP).subscribe(() => {

      this.toastr.success(`Payment ${paymentP.amount} is saved successfully`, 'Payment saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Payment ${paymentP.amount}`, 'Payment not saved');
      console.error(error);

    });

  }

}
