import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { permissions as permissionsT} from '@shared/util/permissions';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';
import { UserService } from '@fboservices/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Permission, User } from '@shared/entity/auth/user';
import { Branch } from '@shared/entity/auth/branch';
import { BranchService } from '@fboservices/auth/branch.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: [ './create-user.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateUserComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  hide = true;

  hide1 = true;

  formHeader = 'Create User';

  permissions: Record<string, Permission> = {};

  itemPermissions: Record<string, Permission> = {};

  salePermissions: Record<string, Permission> = {};

  purchasePermissions: Record<string, Permission> = {};

  accountPermissions: Record<string, Permission> = {};

  voucherPermissions: Record<string, Permission> = {};

  settingsPermissions: Record<string, Permission> = {};

  pcMap = [ {
    permisions: [ 'unit', 'tax', 'category', 'product', 'bank' ],
    category: this.itemPermissions,

  },

  {
    permisions: [ 'invoice', 'revenue', 'customer' ],
    category: this.salePermissions,
  },
  {
    permisions: [ 'bill', 'payment', 'vendor' ],
    category: this.purchasePermissions,
  },

  {
    permisions: [ 'ledgergroup', 'ledger', 'costcentre' ],
    category: this.accountPermissions,
  },

  {
    permisions: [ 'voucher' ],
    category: this.voucherPermissions,
  },

  {
    permisions: [ 'user', 'branch', 'finyear' ],
    category: this.settingsPermissions,
  } ];


  branchAuto = new FormControl();

  separatorKeysCodes: number[] = [ ENTER, COMMA ];

  @ViewChild('branchInput') branchInput: ElementRef<HTMLInputElement>;

  form: FormGroup = new FormGroup({

    id: new FormControl(null),
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    cPassword: new FormControl('', [ Validators.required ]),
  });

  error: string;

  branchFiltered: Array<Branch> = [];

  selectedBranches: Array<Branch> = [];

  constructor(public readonly router: Router,
              public readonly route: ActivatedRoute,
              private readonly toastr: ToastrService,
              private readonly userService: UserService,
              private readonly branchService: BranchService) { }

    private mergePermissions = (permKey: string, pPermissions: Record<string, Permission>) => {

      const perm = permissionsT[permKey];
      for (const opt in perm.operations) {

        if (!perm.operations.hasOwnProperty(opt)) {

          continue;

        }
        if (!pPermissions[permKey]) {

          pPermissions[permKey] = {...perm};
          const opt3s = pPermissions[permKey].operations;
          for (const opt2 in opt3s) {

            if (!opt3s.hasOwnProperty(opt2)) {

              continue;

            }
            opt3s[opt2] = false;

          }
          continue;

        }
        const opt2s = pPermissions[permKey].operations;
        for (const opt2 in opt2s) {

          if (!opt2s.hasOwnProperty(opt2)) {

            continue;

          }
          opt2s[opt2] = opt2s[opt2] ?? false;

        }

      }

    }

    private handleBranchValueChanges = (branchQ: unknown) => {

      if (!branchQ) {

        return;

      }

      if (typeof branchQ !== 'string') {

        const branch = branchQ as Branch;
        this.selectedBranches.push(branch);
        this.branchInput.nativeElement.value = '';
        this.branchAuto.setValue(null);
        return;

      }
      this.branchService.search({ where: {name: {like: branchQ,
        options: 'i'}} })
        .subscribe((branch) => (this.branchFiltered = branch));

    }

    private fetchUserBranches = (branchIds: Array<string>): void => {

      const queryData: QueryData = {
        where: {
          id: {
            inq: branchIds
          }
        }
      };
      this.branchService.search(queryData).subscribe((branches) => {

        this.selectedBranches = branches;
        this.loading = false;

      });

    }

    private categorisePermissions = (permKey: string, userC: User) => {

      const pcObj2 = this.pcMap.find((pcObj) => pcObj.permisions.includes(permKey));


      if (pcObj2) {

        pcObj2.category[permKey] = userC.permissions[permKey] ?? null;
        this.mergePermissions(permKey, pcObj2.category);

      } else {

        this.permissions[permKey] = userC.permissions[permKey] ?? null;
        this.mergePermissions(permKey, this.permissions);

      }


    }

    ngOnInit(): void {


      this.branchAuto.valueChanges.subscribe(this.handleBranchValueChanges);

      const tId = this.route.snapshot.queryParamMap.get('id');

      if (tId) {

        this.formHeader = 'Update User';

        this.userService.get(tId, {}).subscribe((userC) => {

          for (const permKey in permissionsT) {

            if (!permissionsT.hasOwnProperty(permKey)) {

              continue;

            }
            this.categorisePermissions(permKey, userC);

          }
          this.form.setValue({
            id: userC.id ?? '',
            name: userC.name ?? '',
            email: userC.email ?? '',
            password: '',
            cPassword: '',
          });

          if (userC.branchIds?.length) {

            this.fetchUserBranches(userC.branchIds);

          } else {

            this.loading = false;

          }

        });

      } else {

        for (const permKey in permissionsT) {

          if (!permissionsT.hasOwnProperty(permKey)) {

            continue;

          }
          const pcObj2 = this.pcMap.find((pcObj) => pcObj.permisions.includes(permKey));
          if (pcObj2) {

            pcObj2.category[permKey] = {...permissionsT[permKey]};
            continue;

          }

          this.permissions[permKey] = {...permissionsT[permKey]};

        }
        this.loading = false;

      }


    }


    extractNameOfObject = (obj: {name: string}): string => obj?.name ?? '';

    removeBranch(branch: Branch): void {

      const index = this.selectedBranches.indexOf(branch);

      if (index >= 0) {

        this.selectedBranches.splice(index, 1);

      }

    }

    upsertUser(): void {


      if (this.form.valid === false) {

        return;

      }

      if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.form.value.email)) {

        this.error = 'Please provide a valid email.';
        return;

      }

      this.loading = true;
      const {cPassword, ...userP} = this.form.value;
      if (this.form.value.password !== cPassword) {

        this.error = 'Password and Confirm password should be same.';
        return;


      }
      const userPerm: User = {
        permissions: this.permissions,
        ...userP
      };
      const selectedBranchIds: Array<string> = [];
      this.selectedBranches.forEach((branch) => selectedBranchIds.push(branch.id));
      userPerm.branchIds = selectedBranchIds;
      this.userService.upsert(userPerm).subscribe(() => {

        this.toastr.success(`User ${userP.name} is saved successfully`, 'User saved');
        this.goToPreviousPage(this.route, this.router);

      }, (error) => {

        const message = error.error?.message ?? `Error in saving User ${userP.name}`;
        this.loading = false;
        this.toastr.error(message, 'User not saved');

      });

    }


}

