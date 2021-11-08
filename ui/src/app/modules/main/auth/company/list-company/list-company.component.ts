import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@fboservices/auth/company.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryData } from '@shared/util/query-data';
import { FilterItem } from '../../../directives/table-filter/filter-item';

import { Company } from '@shared/entity/auth/company';
import { FilterCompanyComponent } from '../filter-company/filter-company.component';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: [ './list-company.component.scss' ]
})
export class ListCompanyComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code', 'email', 'address'];


  columnHeaders = {
    name: 'Name',
    code: 'Code',
    email: 'Email',
    address: 'Address',

  }

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
    private companyService: CompanyService) { }


  private loadData = () => {

    this.loading = true;
    this.companyService.list(this.queryParams).subscribe((companies) => {


      this.companies = companies;

      this.loading = false;


    }, (error) => {

      console.error(error);
      this.loading = false;

    });

  };


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterCompanyComponent, {});

  }

  ngAfterViewInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      const {whereS, ...qParam} = value;
      this.queryParams = qParam;
      if (whereS) {

        this.queryParams.where = JSON.parse(whereS);

      }

      this.loadData();


    });

  }


}
