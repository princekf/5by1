import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ILineData } from './line-chart/ILineData';
import { IPieData } from './pie-chart/IPieData';
import { ISummary } from './summary-card/ISummary';
import { ITableData } from './summary-table/ITableData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  });

  dSummarys:Array<ISummary> = [
    {
      type: 'Summary',
      width: 'width33',
      title: {
        value: 'Total income',
        icon: 'payments'
      },
      content: '$4,567',
      footer: {
        left: 'Receivables',
        right: '$0.00/$0.00'
      }
    },
    {
      type: 'Summary',
      width: 'width33',
      title: {
        value: 'Total expenses',
        icon: 'account_balance_wallet'
      },
      content: '$4,567',
      footer: {
        left: 'Payables',
        right: '$0.00/$0.00'
      }
    },
    {
      type: 'Summary',
      width: 'width33',
      title: {
        value: 'Total profit',
        icon: 'account_balance'
      },
      content: '$4,567',
      footer: {
        left: 'Upcoming',
        right: '$0.00/$0.00'
      }
    }
  ];

  dItemsLines:Array<ILineData> = [
    {
      type: 'LineChart',
      width: 'width100',
      title: {
        value: 'Cash flow',
      },
      results: [
        {
          'name': 'Income',
          'series': [
            {
              'name': 'Jan',
              'value': 0
            },
            {
              'name': 'Feb',
              'value': 5000
            },
            {
              'name': 'Mar',
              'value': 0
            },
            {
              'name': 'Apr',
              'value': 0
            },
            {
              'name': 'May',
              'value': 0
            },
            {
              'name': 'Jun',
              'value': 0
            }
          ]
        },
        {
          'name': 'Expenses',
          'series': [
            {
              'name': 'Jan',
              'value': 0
            },
            {
              'name': 'Feb',
              'value': 2500
            },
            {
              'name': 'Mar',
              'value': 0
            },
            {
              'name': 'Apr',
              'value': 0
            },
            {
              'name': 'May',
              'value': 0
            },
            {
              'name': 'Jun',
              'value': 0
            }
          ]
        },

        {
          'name': 'Profit',
          'series': [
            {
              'name': 'Jan',
              'value': 0
            },
            {
              'name': 'Feb',
              'value': 1000
            },
            {
              'name': 'Mar',
              'value': 0
            },
            {
              'name': 'Apr',
              'value': 0
            },
            {
              'name': 'May',
              'value': 0
            },
            {
              'name': 'Jun',
              'value': 0
            }
          ]
        }
      ]
    }
  ];

  dItemsPie: Array<IPieData> = [
    {
      type: 'PieChart',
      width: 'width50',
      title: {
        value: 'Income by category',
      },
      results: [
        {
          name: 'Sales',
          value: 8940000
        },
        {
          name: 'Deposit',
          value: 5000000
        }
      ]
    },
    {
      type: 'PieChart',
      width: 'width50',
      title: {
        value: 'Expenses by category',
      },
      results: [
        {
          name: 'Sales',
          value: 8940000
        },
        {
          name: 'Deposit',
          value: 5000000
        }
      ]
    }
  ]

  tableDatas:Array<ITableData> = [ {
    type: 'Table',
    width: 'width33',
    title: {
      value: 'Account balance',
      icon: 'account_balance'
    },
    results: [
      {'name': 'Cash',
        'balance': 23000},
      {'name': 'HDFC',
        'balance': 112398},
      {'name': 'SBI',
        'balance': 45673},
    ]
  },
  {
    type: 'Table',
    width: 'width33',
    title: {
      value: 'Latest Income',
      icon: 'payments'
    },
    results: [
      {'date': '01-May-2021',
        'category': 'SW Development',
        'amount': 23000},
      {'date': '25-Apr-2021',
        'category': 'Server Rent',
        'amount': 4576},
      {'date': '24-Apr-2021',
        'category': 'Tax Refund',
        'amount': 1235},
    ]
  },
  {
    type: 'Table',
    width: 'width33',
    title: {
      value: 'Latest expenses',
      icon: 'account_balance_wallet'
    },
    results: [
      {'date': '01-May-2021',
        'category': 'Office rent',
        'amount': 23000},
      {'date': '25-Apr-2021',
        'category': 'Internet charge',
        'amount': 4576},
      {'date': '24-Apr-2021',
        'category': 'Salary',
        'amount': 1235},
    ]
  } ]

  dItems:Array<ISummary | ILineData | IPieData| ITableData> = [ ...this.dSummarys,
    ...this.dItemsLines, ...this.dItemsPie, ...this.tableDatas ];

  constructor() { }

  ngOnInit(): void {
  }

}
