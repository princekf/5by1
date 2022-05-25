import { Component, OnInit } from '@angular/core';
import { environment } from '@fboenvironments/environment';
import { UserService } from '@fboservices/user.service';
import { Branch } from '@shared/entity/auth/branch';
import { Company } from '@shared/entity/auth/company';
import { FinYear } from '@shared/entity/auth/fin-year';
import { User } from '@shared/entity/auth/user';
import * as dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { ACCESS_TOKEN_ID } from '@shared/Constants';
import { Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { LOCAL_USER_KEY } from '@fboutil/constants';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: [ './my-account.component.scss' ]
})


export class MyAccountComponent implements OnInit {


  loading = true;

  user: User;

  company: Company;

  branch: Branch;

  finYear: FinYear;

  branches: Array<Branch>;

  finYears: Array<FinYear>;

  sendNewData: string

  displayedColumns: string[] = [ 'name', 'code', 'startDate', 'endDate', 'action' ];

  constructor(private userService: UserService,
    private dataService: MainService,
    private readonly toastr: ToastrService,
    private readonly router: Router) { }

  ngOnInit(): void {

    this.loading = true;
    this.userService.myAccount().subscribe((myAccount) => {

      this.user = myAccount.user;
      this.company = myAccount.company;
      const { sessionUser } = myAccount;
      this.branches = myAccount.branches;
      this.finYears = myAccount.finYears;
      this.branch = myAccount.branches.find((branch) => new RegExp(`^${branch.code}$`, 'ui').test(sessionUser.branch));
      this.finYear = myAccount.finYears.find((finYear) => new RegExp(`^${finYear.code}$`, 'ui').test(sessionUser.finYear));
      this.loading = false;

    });

  }

  createDataSource = (branchId: string): Array<FinYear> => this.finYears.filter((fYear) => fYear.branchId === branchId);

  parseDate = (cValue: string): string => dayjs(cValue).format(environment.dateFormat);

  changeFinYear = (finYearC: FinYear): void => {

    this.loading = true;
    this.userService.changeFinYear(finYearC.id).subscribe(async(authResp) => {

      this.loading = false;
      localStorage.setItem(ACCESS_TOKEN_ID, authResp.token);
      this.toastr.success(`Switched to financial year ${finYearC.name}`, 'Switched finacial year.');
      const userResp = await this.userService.findMe().toPromise();
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userResp));
      this.setUserInfo(localStorage.getItem(LOCAL_USER_KEY));
      this.router.navigate([ '/' ]);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving switching financial year ${finYearC.name}`, 'Unable to switch financial year.');
      console.error(error);

    });

  }

  setUserInfo(data: string): void {

    this.dataService.setUserInfo(data);

  }


}

