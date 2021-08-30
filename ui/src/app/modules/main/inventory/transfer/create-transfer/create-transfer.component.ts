import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BankService } from '@fboservices/inventory/bank.service';
import { TransferService } from '@fboservices/inventory/transfer.service';
import { Bank } from '@shared/entity/inventory/bank';
import { Transfer } from '@shared/entity/inventory/transfer';

@Component({
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrls: ['./create-transfer.component.scss']
})
export class CreateTransferComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
