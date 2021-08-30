import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-transfer',
  templateUrl: './delete-transfer.component.html',
  styleUrls: ['./delete-transfer.component.scss']
})
export class DeleteTransferComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = [ 'fromAccount.name', 'toAccount.name', 'transferDate', 'amount', 'description', ];

  columnHeaders = {
    'fromAccount.name': 'From Account',
    'toAccount.name': 'To Account',
    transferDate: 'Transfer Date',
    amount: 'Amount',
    description: 'Description',

  }

  goToPreviousPage = _goToPreviousPage;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<Transfer>([]);

  findColumnValue = _findColumnValue;

  loading =true;

  constructor(
     public readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly transferService:TransferService,
    private readonly mainService: MainService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
