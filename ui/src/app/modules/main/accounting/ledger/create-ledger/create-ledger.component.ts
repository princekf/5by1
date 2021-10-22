import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ledger } from '@shared/entity/accounting/ledger';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-ledger',
  templateUrl: './create-ledger.component.html',
  styleUrls: [ './create-ledger.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateLedgerComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Ledger';

  ledgerGroupFiltered: Array<LedgerGroup> = [];

  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    name: new FormControl('', [ Validators.required ]),

    ledgerGroup: new FormControl('', [ Validators.required ]),

    refNo: new FormControl('', [ Validators.required ]),

    details: new FormControl('', [ Validators.required ]),

  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly ledgerService: LedgerService,
    private readonly toastr: ToastrService,
    private readonly ledgergroupService:LedgergroupService) { }

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');

    if (tId) {

      this.formHeader = 'Update Ledger';

      const queryParam:QueryData = {
        include: [
          {relation: 'ledgerGroup'}
        ]
      };
      this.ledgerService.get(tId, queryParam).subscribe((ledgerC) => {

        this.form.setValue({
          id: ledgerC.id ?? '',
          name: ledgerC.name ?? '',
          ledgerGroup: ledgerC.ledgerGroup ?? '',
          refNo: ledgerC.refNo ?? '',
          details: ledgerC.details ?? '',

        });

        this.loading = false;

      });

    } else {

      this.loading = false;

    }

  }

  private initValueChanges = () => {

    this.form.controls.ledgerGroup.valueChanges.subscribe((ledgerQ:unknown) => {

      if (typeof ledgerQ !== 'string') {

        return;

      }
      this.ledgergroupService.search({ where: {name: {like: ledgerQ,
        options: 'i'}} })
        .subscribe((ledgerGroups) => (this.ledgerGroupFiltered = ledgerGroups));

    });

  };

  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertLedger(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const LedgerP = <Ledger> this.form.value;


    this.ledgerService.upsert(LedgerP).subscribe(() => {

      this.toastr.success(`Ledger ${LedgerP.name} is saved successfully`, 'Ledger saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Ledger ${LedgerP.name}`, 'Ledger not saved');
      console.error(error);

    });

  }


}
