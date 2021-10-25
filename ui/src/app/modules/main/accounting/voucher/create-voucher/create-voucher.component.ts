import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Voucher, VoucherType} from '@shared/entity/accounting/voucher';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { MatTableDataSource } from '@angular/material/table';
import { Ledger } from '@shared/entity/accounting/ledger';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: [ './create-voucher.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateVoucherComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;


  iserror = false;


  voucherTypeFiltered = VoucherType;

  loading = true;

  formHeader = 'Create Voucher';

  voucherType: Array<VoucherType> = [];

  displayedColumns: string[] = [ 'ledger', 'debit', 'credit', 'action' ];


  dataSource = new MatTableDataSource<AbstractControl>();

  form: FormGroup;

  ledgerFiltered: Array<Ledger> = [];


  propertyNames = Object.entries(this.voucherTypeFiltered);

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly voucherService: VoucherService,
    private readonly ledgerService: LedgerService,
    private readonly toastr: ToastrService,
    private readonly fBuilder: FormBuilder,) { }


    // private createTransactionFormGroup = (tItem?: Transaction): FormGroup => {

    //   const ledger = this.fBuilder.control(tItem?.ledger ?? '', [ Validators.required, ]);
    //   const debit = this.fBuilder.control(tItem?.debit ?? 0, [ Validators.required ]);
    //   const credit = this.fBuilder.control(tItem?.credit ?? 0, [ Validators.required ]);

    //   return this.fBuilder.group({
    //     ledger,
    //     debit,
    //     credit,

    //   });

    // };


    // private createTransactionForm = (transaction?: Transaction): FormGroup => {


    //   const fGrp = this.createTransactionFormGroup(transaction);
    //   const {ledger} = fGrp.controls;
    //   ledger.valueChanges.subscribe((value) => {

    //     if (typeof value === 'object') {

    //       const formArray = this.form.get('transaction') as FormArray;
    //       const lastFormGroup = formArray.get([ formArray.length - 1 ]) as FormGroup;
    //       if (lastFormGroup.controls.ledger.value) {

    //         formArray.push(this.createTransactionForm());
    //         this.dataSource = new MatTableDataSource(formArray.controls);
    //         this.createTransactionFormGroup().reset();

    //       }
    //       this.iserror = true;
    //       return;

    //     }


    //     this.ledgerService.list({ where: {name: {like: value,
    //       options: 'i'}}, }).subscribe((ledgerP) => (this.ledgerFiltered = ledgerP.items));

    //   });

    //   return fGrp;

    // }


    private initFboForm = () => {

      this.form = this.fBuilder.group({

        id: new FormControl(null),

        number: new FormControl('', [ Validators.required ]),

        type: new FormControl(''),

        date: new FormControl(new Date(), [ Validators.required ]),

        details: new FormControl('', [ Validators.required ]),

        // transaction: this.fBuilder.array([
        //   this.createTransactionForm(),
        // ])

      });

    }

    ngOnInit(): void {

      this.initFboForm();

      // const formArray = this.form.get('transaction') as FormArray;
      // this.dataSource = new MatTableDataSource(formArray.controls);


      const tId = this.route.snapshot.queryParamMap.get('id');

      if (tId) {

        this.formHeader = 'Update voucher';

        this.voucherService.get(tId, {}).subscribe((voucherC) => {

          this.form.setValue({
            id: voucherC.id ?? '',
            number: voucherC.number ?? '',
            type: voucherC.type ?? '',
            date: voucherC.date ?? '',
            details: voucherC.details ?? '',

          });

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    }

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertVoucher(): void {


    // const itemsFormArray = <FormArray> this.form.get('transaction');
    // for (let idx = itemsFormArray.length - 1; idx >= 0; idx--) {

    //   const curFgr = itemsFormArray.get([ idx ]) as FormGroup;
    //   if (!curFgr.controls.ledger.value) {

    //     itemsFormArray.removeAt(idx);

    //   }

    // }

    if (!this.form.valid) {

      return;


    }
    this.loading = true;
    const voucherP = <Voucher> this.form.value;

    this.voucherService.upsert(voucherP).subscribe(() => {

      this.toastr.success(`Voucher ${voucherP.number} is saved successfully`, 'Voucher saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Voucher ${voucherP.number}`, 'Voucher not saved');
      console.error(error);

    });

  }


  // removeAt= (idx:number): void => {


  //   const itemsFormArray = <FormArray> this.form.get('transaction');


  //   const curFgr = itemsFormArray.get([ idx ]) as FormGroup;

  //   if (curFgr.controls.ledger.value) {

  //     if (typeof curFgr.controls.ledger.value !== 'object') {

  //       curFgr.get('ledger').setValue('');

  //       this.createTransactionFormGroup().reset();
  //       this.createTransactionForm();

  //     } else {

  //       const {data} = this.dataSource;
  //       data.splice(idx, 1);
  //       this.dataSource.data = data;

  //       itemsFormArray.updateValueAndValidity();
  //       this.form.updateValueAndValidity();

  //       this.createTransactionFormGroup().reset();

  //     }

  //   }

  // }

}

