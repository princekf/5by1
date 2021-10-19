import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankService } from '@fboservices/inventory/bank.service';
import { TransferService } from '@fboservices/inventory/transfer.service';
import { Bank } from '@shared/entity/inventory/bank';
import { Transfer } from '@shared/entity/inventory/transfer';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
@Component({
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrls: [ './create-transfer.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateTransferComponent implements OnInit {


  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Transfer';


  fromAccount$: Observable<Array<Bank>>;

  toAccount$: Observable<Array<Bank>>;


  banks: Array<Bank> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    fromAccount: new FormControl('', [ Validators.required ]),

    toAccount: new FormControl('', [ Validators.required ]),

    transferDate: new FormControl(new Date(), [ Validators.required ]),

    amount: new FormControl(0, [ Validators.required ]),

    description: new FormControl(''),

  });


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly transferService: TransferService,
    private readonly bankService: BankService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.initValueChanges();


    const tId = this.route.snapshot.queryParamMap.get('id');
    this.loading = true;
    this.bankService.search({}).subscribe((banks) => {

      this.banks = banks;
      if (tId) {


        this.formHeader = 'Update Transfer';

        const queryParam:QueryData = {
          include: [
            {relation: 'fromAccount'},
            {relation: 'toAccount'}
          ]
        };
        this.transferService.get(tId, queryParam).subscribe((transferC) => {

          this.form.setValue({
            id: transferC.id ?? '',
            fromAccount: transferC.fromAccount ? this.banks.find((bnk) => bnk.id === transferC.fromAccount.id) : '',
            toAccount: transferC.toAccount ? this.banks.find((bnk) => bnk.id === transferC.toAccount.id) : '',
            transferDate: transferC.transferDate ?? '',
            amount: transferC.amount ?? '',
            description: transferC.description ?? ''
          });
          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    });

  }


  extractNameOfObject = (obj: {name: string}): string => obj.name;

  private initValueChanges = () => {

    this.fromAccount$ = this.form.controls.fromAccount.valueChanges
      .pipe(flatMap((fromAccountQ) => {

        if (typeof fromAccountQ !== 'string') {

          return [];

        }
        return this.bankService.search({ where: {name: {like: fromAccountQ,
          options: 'i'}} });

      }));
    this.toAccount$ = this.form.controls.toAccount.valueChanges
      .pipe(flatMap((toAccountQ) => {

        if (typeof toAccountQ !== 'string') {

          return [];

        }
        return this.bankService.search({ where: {name: {like: toAccountQ,
          options: 'i'}} });

      }));

  }

  upsertTransfer(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const transferP = <Transfer> this.form.value;


    this.transferService.upsert(transferP).subscribe(() => {

      this.toastr.success(`transfer ${transferP.description} is saved successfully`, 'transfer saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving transfer ${transferP.description}`, 'transfer not saved');
      console.error(error);

    });

  }

}

