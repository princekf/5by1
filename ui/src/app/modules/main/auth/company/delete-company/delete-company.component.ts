import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@fboservices/auth/company.service';
import { MainService } from '@fboservices/main.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue, goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { QueryData } from '@shared/util/query-data';
import { Company } from '@shared/entity/auth/company';

@Component({
  selector: 'app-delete-company',
  templateUrl: './delete-company.component.html',
  styleUrls: [ './delete-company.component.scss', '../../../../../util/styles/fbo-table-style.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DeleteCompanyComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code', 'email', 'address', ];


  columnHeaders = {
    name: 'Name',
    code: 'code',
    email: 'Email',
    address: 'Address',

  }

  loading = true;

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Company>([]);

  findColumnValue = _findColumnValue;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly companyService: CompanyService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const tIds = this.route.snapshot.queryParamMap.get('ids');
    const tIdArray = tIds.split(',');
    const queryData:QueryData = {
      where: {
        id: {
          inq: tIdArray
        }
      }
    };
    this.companyService.search(queryData).subscribe((company) => {

      this.dataSource.data = company;
      this.loading = false;

    });

  }

  ngAfterViewInit(): void {

    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }

  }

  deleteCompanys(): void {

    this.loading = true;
    const companies = this.dataSource.data;
    const tIds = [];
    companies.forEach((companyP) => tIds.push(companyP.id));
    const where = {id: {
      inq: tIds
    }};
    this.companyService['delete'](where).subscribe((count) => {

      this.loading = false;
      this.toastr.success(`${count.count} Companys are deleted successfully`, 'Companys deleted');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error('Error in deleting Companys', 'Company not deleted');
      console.error(error);

    });

  }

}
