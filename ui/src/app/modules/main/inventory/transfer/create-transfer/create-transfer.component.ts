import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankService } from '@fboservices/inventory/bank.service';
import { TransferService } from '@fboservices/inventory/transfer.service';
import { Bank } from '@shared/entity/inventory/bank';
import {Transfer} from '@shared/entity/inventory/transfer';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
@Component({
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrls: [ './create-transfer.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateTransferComponent implements OnInit {


  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Transfer';


  banks: Array<Bank> = [];

  transfers: Array<Transfer> = [];

  form: FormGroup = new FormGroup({

    _id: new FormControl(null),

    fromAccount: new FormControl('', [ Validators.required ]),

    toAccount: new FormControl('', [ Validators.required ]),

    transferDate: new FormControl('', [ Validators.required ]),

    amount: new FormControl('', [ Validators.required ]),

    description: new FormControl('', [ Validators.required ]),

  });


  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly transferService: TransferService,
    private readonly bankService: BankService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {


    const tId = this.route.snapshot.queryParamMap.get('id');

    this.bankService.listAll().subscribe((banks) => {

      this.banks = banks;

    });
    this.transferService.listAll().subscribe((transfers) => {

      this.transfers = transfers;
      this.loading = false;
      if (tId) {


        this.formHeader = 'Update Transfer';
        this.loading = true;
        this.transferService.get(tId).subscribe((transferC) => {

          this.form.setValue({
            _id: transferC._id ?? '',
            fromAccount: transferC.fromAccount ?? '',
            toAccount: transferC.toAccount ?? '',
            transferDate: transferC.transferDate ?? '',
            amount: transferC.amount ?? '',
            description: transferC.description ?? ''
          });

          this.loading = false;

        });

      }

    });

  }

  upsertTransfer(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const transferP = <Transfer> this.form.value;


    // eslint-disable-next-line max-len
    (transferP._id ? this.transferService.update(transferP) : this.transferService.save(transferP)).subscribe((transferC) => {

      this.toastr.success(`transfer ${transferC.description} is saved successfully`, 'transfer saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving transfer ${transferP.description}`, 'transfer not saved');
      console.error(error);

    });

  }

}

