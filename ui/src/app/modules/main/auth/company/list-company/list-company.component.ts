import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CompanyService } from '@fboservices/auth/company.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { Company } from '@shared/entity/auth/company';
import { FilterCompanyComponent } from '../filter-company/filter-company.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportPopupComponent } from '../../../export-popup/export-popup.component';
import { MainService } from '../../../../../services/main.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: [ './list-company.component.scss' ]
})
export class ListCompanyComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'name', 'code', 'email', 'address' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    email: 'Email',
    address: 'Address',

  };

   iheaders = [
     'Name',
     'Code',
     'Email',
     'Address',

   ];

  xheaders = [

    {key: 'name',
      width: 30, },
    {key: 'code',
      width: 15 },
    { key: 'email',
      width: 35 },
    {key: 'address',
      width: 50 },
  ];

  loading = true;

  queryParams: QueryData = {};

  routerSubscription: Subscription;


  companies: ListQueryRespType<Company> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };


  filterItem: FilterItem;

  constructor(private activatedRoute: ActivatedRoute,
              private companyService: CompanyService,
              private dialog: MatDialog,
              private mainservice: MainService,) { }


  private loadData = () => {

    this.loading = true;
    this.companyService.list(this.queryParams).subscribe((companies) => {


      this.companies = companies;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterCompanyComponent, {});

  }

  ngAfterViewInit(): void {

    this.activatedRoute.queryParams.subscribe((value) => {

      const {whereS, ...qParam} = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      }

      this.loadData();


    });

  }

  handleExportClick = (): void => {

    const tParams = {...this.queryParams};
    tParams.limit = this.companies.totalItems;
    this.loading = true;
    const data = [];
    this.companyService.queryData(tParams).subscribe((items) => {

      items.forEach((element) => {

        const temp = [ element.name, element.code, element.email, element.address ];

        data.push(temp);

      });
      const result = {
        cell: this.c,
        rheader: this.iheaders,
        eheader: this.xheaders,
        header: this.columnHeaders,
        rowData: data
      };
      this.mainservice.setExport(result);

      this.dialog.open(ExportPopupComponent, {height: '500px',
        data: {items,
          displayedColumns: this.displayedColumns,
          columnHeaders: this.columnHeaders}});
      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  }

}
