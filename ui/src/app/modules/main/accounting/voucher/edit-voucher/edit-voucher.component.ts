import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { goToPreviousPage as _goToPreviousPage } from '@fboutil/fbo.util';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: [ './edit-voucher.component.scss' ]
})
export class EditVoucherComponent implements OnInit {

  goToPreviousPage = _goToPreviousPage;

  loading = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private voucherService: VoucherService,
  ) { }

  ngOnInit(): void {

    const tId = this.route.snapshot.queryParamMap.get('id');
    if (!tId) {

      this.goToPreviousPage(this.route, this.router);
      return;

    }
    this.loading = true;
    this.voucherService.get(tId, {}).subscribe((voucher) => {

      const uri = `/voucher/${voucher.type?.toLocaleLowerCase()}/create`;
      this.loading = false;
      const burl = this.route.snapshot.queryParamMap.get('burl') ?? '/';

      this.router.navigate([ uri ], {queryParams: {burl,
        id: tId}});

    }, (err) => {

      this.loading = false;

    });

  }

}
