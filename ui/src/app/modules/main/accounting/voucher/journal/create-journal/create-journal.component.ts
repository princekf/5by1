import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CostCentreService } from '@fboservices/accounting/cost-centre.service';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { CostCentre } from '@shared/entity/accounting/cost-centre';
import { Ledger } from '@shared/entity/accounting/ledger';
import { Transaction, TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher, VoucherType } from '@shared/entity/accounting/voucher';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-journal',
  templateUrl: './create-journal.component.html',
  styleUrls: [ './create-journal.component.scss' ]
})
export class CreateJournalComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Journal';

  loading = true;

  fboForm: FormGroup;

  transactionsDS = new MatTableDataSource<AbstractControl>();

  displayedColumns: string[] = [ 'ledger', 'amount', 'costCentre', 'details', 'action' ];

  ledgersFiltered: Array<Ledger> = [];

  costCentresFiltered: Array<CostCentre> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  primaryTransactionType = TransactionType.CREDIT;

  tType = TransactionType;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private voucherService: VoucherService,
    private ledgerService: LedgerService,
    private costCentreService: CostCentreService,
    private readonly fBuilder: FormBuilder,
    private readonly toastr: ToastrService,) { }

    private handleCostCentreAutoChange = (costCentreQ:unknown) => {

      if (typeof costCentreQ !== 'string') {

        this.costCentresFiltered = [];
        return;

      }
      this.costCentreService.search({ where: {name: {like: costCentreQ,
        options: 'i'}} })
        .subscribe((costCentres) => (this.costCentresFiltered = costCentres));

    };

    private handleLedgerAutoChange = (ledgerQ:unknown) => {

      if (typeof ledgerQ !== 'string') {

        return;

      }
      this.ledgerService.search({ where: {name: {like: ledgerQ,
        options: 'i'}} })
        .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

    };

    private addTransactionFormToVoucher = () => {

      const formArray = this.fboForm.get('transactions') as FormArray;
      const lastFormGroup = formArray.get([ formArray.length - 1 ]) as FormGroup;
      if (lastFormGroup.controls.ledger.value) {

        formArray.push(this.createCompoundTransactionForm());
        this.transactionsDS = new MatTableDataSource(formArray.controls);

      }

    }

    private handleLedgerCompoundAutoChange = (ledgerQ:unknown) => {

      if (typeof ledgerQ !== 'string') {

        this.addTransactionFormToVoucher();
        this.ledgersCompoundFiltered = [];
        return;

      }
      this.ledgerService.search({ where: {name: {like: ledgerQ,
        options: 'i'}} })
        .subscribe((ledgers) => (this.ledgersCompoundFiltered = ledgers));

    };

    private createTransactionForm = (transaction?: Transaction): FormGroup => {

      const ledger = this.fBuilder.control(transaction?.ledger ?? '', [ Validators.required, ]);
      const amount = this.fBuilder.control(transaction?.amount ?? 0, [ Validators.required, ]);
      const type = this.fBuilder.control(transaction?.type ?? TransactionType.CREDIT, [ Validators.required, ]);
      const costCentre = this.fBuilder.control(transaction?.costCentre ?? '');
      const details = this.fBuilder.control(transaction?.details ?? '');

      return this.fBuilder.group({
        ledger,
        amount,
        type,
        costCentre,
        details,
      });

    }

    private createPrimaryTransactionForm = (transaction?: Transaction): FormGroup => {

      const fGroup = this.createTransactionForm(transaction);
      fGroup.controls.costCentre.valueChanges.subscribe(this.handleCostCentreAutoChange);
      fGroup.controls.ledger.valueChanges.subscribe(this.handleLedgerAutoChange);
      return fGroup;

    }

    private updateAmountChanges = () => {

      const formArray = this.fboForm.get('transactions') as FormArray;
      let totalAmount = 0;
      for (let idx = 1; idx < formArray.length; idx++) {

        const curFormGroup = formArray.get([ idx ]) as FormGroup;
        totalAmount += curFormGroup.controls.amount.value;

      }
      const primaryFormGroup = formArray.get([ 0 ]) as FormGroup;
      primaryFormGroup.controls.amount.setValue(totalAmount);

    }

    private createCompoundTransactionForm = (transaction?: Transaction): FormGroup => {

      const fGroup = this.createTransactionForm(transaction);
      fGroup.controls.ledger.valueChanges.subscribe(this.handleLedgerCompoundAutoChange);
      fGroup.controls.costCentre.valueChanges.subscribe(this.handleCostCentreAutoChange);
      fGroup.controls.amount.valueChanges.subscribe(this.updateAmountChanges);
      return fGroup;

    }

  private initFboForm = () => {

    this.fboForm = this.fBuilder.group({
      id: new FormControl(null),
      number: new FormControl('', [ Validators.required ]),
      date: this.fBuilder.control(new Date(), [ Validators.required ]),
      type: this.fBuilder.control(VoucherType.JOURNAL, [ Validators.required ]),
      details: this.fBuilder.control(''),
      transactions: this.fBuilder.array([
        this.createPrimaryTransactionForm(),
        this.createCompoundTransactionForm(),
      ])
    });

  }

  ngOnInit(): void {

    this.initFboForm();
    const formArray = this.fboForm.get('transactions') as FormArray;
    this.transactionsDS = new MatTableDataSource(formArray.controls);
    this.loading = false;

  }

  getProperLedgers = (idx:number):Array<Ledger> => {

    if (idx > 0) {

      return this.ledgersCompoundFiltered;

    }
    return this.ledgersFiltered;

  };

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  shouldShowDelete = (idx: number):boolean => {

    if (idx === 0) {

      return false;

    }
    const minimumCount = 2;
    // Don't delete the last one.
    return this.transactionsDS.data.length > minimumCount && idx < this.transactionsDS.data.length - 1;

  };

  removeAt = (idx: number):void => {

    const formArray = this.fboForm.get('transactions') as FormArray;
    formArray.removeAt(idx);
    this.updateAmountChanges();
    this.transactionsDS = new MatTableDataSource(formArray.controls);

  }

  findTransactionType = (idx: number):string => {

    if (idx === 0) {

      return this.primaryTransactionType;

    }

    return this.primaryTransactionType === TransactionType.CREDIT ? TransactionType.DEBIT : TransactionType.CREDIT;

  }

  private createNewCompoundTransaction = (transaction: Transaction, order: number): Transaction => {

    transaction.ledgerId = transaction.ledger.id;
    transaction.type = this.primaryTransactionType === this.tType.CREDIT ? this.tType.DEBIT : this.tType.CREDIT;
    if (transaction.costCentre?.id) {

      transaction.costCentreId = transaction.costCentre.id;

    }
    const {id, type, ledgerId, amount, details, costCentreId} = transaction;
    return {id,
      type,
      ledgerId,
      amount,
      details,
      costCentreId,
      order};

  }

  private fillTransactions = (voucher:Voucher) => {

    const transactions:Array<Transaction> = [];
    const [ primaryTransaction, ...compoundTransactions ] = voucher.transactions;
    if (!primaryTransaction.ledger?.id) {

      throw new Error('Please enter valid primary transaction.');

    }
    const order = 1;
    primaryTransaction.type = this.primaryTransactionType;
    const {id, type, ledger, amount, details, costCentre} = primaryTransaction;
    const ledgerId = ledger?.id;
    const costCentreId = costCentre?.id;
    transactions.push({id,
      type,
      order,
      ledgerId,
      amount,
      details,
      costCentreId});
    for (let idx = 0; idx < compoundTransactions.length; idx++) {

      const transaction = compoundTransactions[idx];
      if (transaction.ledger?.id) {

        if (transaction.amount <= 0) {

          throw new Error(`Please enter valid transactions, amount againt ${transaction.ledger.name} is invalid.`);

        }
        transactions.push(this.createNewCompoundTransaction(transaction, transactions.length + 1));

      }

    }
    const minimumTransactions = 2;
    if (transactions.length < minimumTransactions) {

      throw new Error('Please enter valid transactions, one credit and one debit transactions.');

    }
    voucher.transactions = transactions;

  }

  upsertVoucher = (): void => {

    if (this.fboForm.controls.number.errors) {

      return;

    }
    const {...voucher} = this.fboForm.value as Voucher;
    try {

      this.fillTransactions(voucher);

    } catch (error) {

      this.toastr.error(error.message, 'Validation failed');
      return;

    }
    this.voucherService.upsert(voucher).subscribe(() => {

      this.toastr.success(`Voucher ${voucher.number} is saved successfully`, 'Voucher saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Voucher ${voucher.number}`, 'Voucher not saved');
      console.error(error);

    });

  }

}
