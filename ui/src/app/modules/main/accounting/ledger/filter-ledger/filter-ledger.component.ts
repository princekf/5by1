import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryData } from '@shared/util/query-data';
import { fillFilterForm, createQueryStringFromFilterForm, FilterFormField } from '@fboutil/filter.util';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';

@Component({
  selector: 'app-filter-ledger',
  templateUrl: './filter-ledger.component.html',
  styleUrls: [ './filter-ledger.component.scss', '../../../../../util/styles/fbo-filter-style.scss' ]
})
export class FilterLedgerComponent implements OnInit {

  queryParams:QueryData = { };

  ledgerGroupsFiltered: Array<LedgerGroup> = [];

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    nameType: new FormControl('^'),
    ledgerGroupId: new FormControl(''),
    ledgerGroupIdType: new FormControl(''),

  });

  constructor(private router:Router,
    private activatedRoute : ActivatedRoute,
    private ledgergroupService: LedgerGroupService) { }

    private handleLedgerGroupAutoChange = (ledgerGQ:string) => {

      if (typeof ledgerGQ !== 'string') {

        return;

      }
      this.ledgergroupService.search({ where: {
        name: {like: ledgerGQ,
          options: 'i'},
      } })
        .subscribe((ledgerGs) => (this.ledgerGroupsFiltered = ledgerGs));

    };


    ngOnInit():void {

      this.filterForm.controls.ledgerGroupId.valueChanges.subscribe(this.handleLedgerGroupAutoChange);
      const whereS = this.activatedRoute.snapshot.queryParamMap.get('whereS');
      fillFilterForm(this.filterForm, whereS);

    }

    ngAfterViewInit():void {


      this.activatedRoute.queryParams.subscribe((value) => {

        this.queryParams = { ...value };

      });

    }

  filterItems = ():void => {


    const formFields: Array<FilterFormField> = [
      {name: 'name',
        type: 'string'},
      {name: 'ledgerGroupId',
        type: 'string'},

    ];
    const whereS = createQueryStringFromFilterForm(this.filterForm, formFields);
    this.router.navigate([], { queryParams: {whereS} });

  };

  extractNameOfLedgerGroup = (idS: string): string => this.ledgerGroupsFiltered.find((ldgr) => ldgr.id === idS)?.name;

}
