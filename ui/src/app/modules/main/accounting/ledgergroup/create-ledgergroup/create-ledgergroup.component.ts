import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { ToastrService } from 'ngx-toastr';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-ledgergroup',
  templateUrl: './create-ledgergroup.component.html',
  styleUrls: [ './create-ledgergroup.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateLedgergroupComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  formHeader = 'Create Ledger Group';

  loading = false;

  ledgerGroups: Array<LedgerGroup> = [];

  ledgerGroups$: Observable<Array<LedgerGroup>>;

  timesConditionallyRequiredValidator = (formControl: AbstractControl): ValidationErrors => {

    if (!formControl.parent) {

      return null;

    }
    if (formControl.parent.get('parent').value) {

      let errors = Validators.required(formControl);
      if (!errors) {

        errors = Validators.min(1)(formControl);

      }
      return errors;

    }
    return null;

  }

  fboForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    parent: new FormControl(''),

    details: new FormControl(''),
  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly ledgergroupService:LedgergroupService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    this.initValueChanges();

    const tId = this.route.snapshot.queryParamMap.get('id');
    this.loading = true;
    this.ledgergroupService.search({}).subscribe((ledgerGroups) => {

      this.ledgerGroups = ledgerGroups;
      if (tId) {

        this.formHeader = 'Update Ledger Group';
        const queryParam:QueryData = {
          include: [
            {relation: 'parent'}
          ]
        };
        this.ledgergroupService.get(tId, queryParam).subscribe((ledgerGroupC) => {

          this.fboForm.setValue({id: ledgerGroupC.id,
            name: ledgerGroupC.name,

            parent: ledgerGroupC.parent ? this.ledgerGroups?.find((ledgerGroupI) => ledgerGroupI.id === ledgerGroupC.parentId) : '',

            details: ledgerGroupC.details ?? ''});

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    });


  }

  private initValueChanges = () => {

    this.ledgerGroups$ = this.fboForm.controls.parent.valueChanges
      .pipe(flatMap((ledgerGroupQ) => {

        if (typeof ledgerGroupQ !== 'string') {

          return [];

        }
        return this.ledgergroupService.search({ where: {name: {like: ledgerGroupQ,
          options: 'i'}} });

      }));

  }


  extractNameOfObject = (obj: {name: string}): string => obj.name;

  upsertLedgerGroup(): void {

    if (!this.fboForm.valid) {

      return;

    }
    this.loading = true;
    const ledgerGroupV = <LedgerGroup> this.fboForm.value;
    const {parent, ...ledgerGroupP} = ledgerGroupV;
    ledgerGroupP.parentId = parent?.id;
    this.ledgergroupService.upsert(ledgerGroupP).subscribe(() => {

      this.toastr.success(`Ledger Group ${ledgerGroupP.name} is saved successfully`, 'Ledger Group saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Ledger Group ${ledgerGroupP.name}`, 'Ledger Group not saved');
      console.error(error);

    });

  }

}
