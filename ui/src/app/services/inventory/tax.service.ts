import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tax } from '@shared/entity/inventory/tax';
import { delay } from 'rxjs/internal/operators';
import { cgst2P5, cgst5, cgst6, cgst9, igst10, igst12, igst18, igst5, sgst2P5, sgst5, sgst6, sgst9 } from '../mock-data/tax.data';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { TAX_API_URI } from '@shared/server-apis';

const FAKE_TIMEOUT = 1000;

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseHTTPService<Tax> {

  public API_URI = TAX_API_URI;

    private items:Array<Tax> = [
      igst5, igst10, igst12, igst18, sgst2P5, sgst5, sgst6, sgst9, cgst2P5, cgst5, cgst6, cgst9
    ]

    public upsert(tax:Tax):Observable<void> {

      const {id, ...tax2} = tax;
      if (id) {

        return super.update({id,
          ...tax2});

      }
      return super.save(tax2);

    }

    public listByIds(taxIds: Array<string>):Observable<Array<Tax>> {

      const fItems = this.items.filter((taxP) => taxIds.includes(taxP.id));
      return of(fItems).pipe(delay(FAKE_TIMEOUT));

    }

    public deleteByIds(taxIds: Array<string>):Observable<Array<Tax>> {

      const deletedArray:Array<Tax> = [];
      const balanceArray:Array<Tax> = [];
      this.items.forEach((taxP) => (taxIds.includes(taxP.id) ? deletedArray.push(taxP) : balanceArray.push(taxP)));
      this.items = balanceArray;
      return of(deletedArray).pipe(delay(FAKE_TIMEOUT));

    }


    public getGroupNames():Observable<Array<string>> {

      const groupNames:Array<string> = [];
      for (const taxP of this.items) {

        if (!groupNames.includes(taxP.groupName)) {

          groupNames.push(taxP.groupName);

        }

      }
      return of(groupNames).pipe(delay(FAKE_TIMEOUT));

    }

}
