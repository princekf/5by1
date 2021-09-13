import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankService } from '@fboservices/inventory/bank.service';
import { Bank } from '@shared/entity/inventory/bank';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: [ './create-bank.component.scss', '../../../../../util/styles/fbo-form-style.scss' ]
})
export class CreateBankComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  formHeader = 'Create Banks';

  banks: Array<Bank> = [];


  form: FormGroup = new FormGroup({

    id: new FormControl(null),

    type: new FormControl('', [ Validators.required ]),

    name: new FormControl('', [ Validators.required ]),

    openingBalance: new FormControl('', [ Validators.required ]),

    description: new FormControl('', [ Validators.required ]),

  });

  constructor(public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly bankService: BankService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');

    this.bankService.listAll().subscribe((banks) => {

      this.banks = banks;

      this.loading = false;
      if (tId) {


        this.formHeader = 'Update Banks';
        this.loading = true;
        this.bankService.get(tId, {}).subscribe((bankC) => {

          this.form.setValue({
            id: bankC.id ?? '',
            type: bankC.type ?? '',
            name: bankC.name ?? '',
            openingBalance: bankC.openingBalance ?? '',
            description: bankC.description ?? ''
          });

          this.loading = false;

        });

      } else {

        this.loading = false;

      }

    });

  }

  upsertBank(): void {


    if (!this.form.valid) {

      return;

    }
    this.loading = true;
    const bankP = <Bank> this.form.value;


    this.bankService.upsert(bankP).subscribe(() => {

      this.toastr.success(`Category ${bankP.name} is saved successfully`, 'Category saved');
      this.goToPreviousPage(this.route, this.router);

    }, (error) => {

      this.loading = false;
      this.toastr.error(`Error in saving Category ${bankP.name}`, 'Category not saved');
      console.error(error);

    });

  }

}
