import { Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@fboservices/main.service';
import { PAGE_SIZE_OPTIONS } from '@fboutil/constants';
import { QueryData } from '@shared/util/query-data';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { SelectionModel } from '@angular/cdk/collections';
import { Tax } from '@shared/entity/inventory/tax';
import { fboTableRowExpandAnimation, findColumnValue as _findColumnValue } from '@fboutil/fbo.util';
import { TableFilterDirective } from '../directives/table-filter/table-filter.directive';
import { FilterItem } from '../directives/table-filter/filter-item';
import { FilterComponent } from '../directives/table-filter/filter-component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [ './data-table.component.scss' ],
  animations: fboTableRowExpandAnimation,
})
export class DataTableComponent {

  @Input() tableHeader: string;

  @Input() columnHeaders: Record<string, string>;

  @Input() numberColumns: Array<string> = [];

  private _tableData:ListQueryRespType<unknown>;

  totalItems:number;

  pageIndex = 0;

  findColumnValue = _findColumnValue;

  @Input()
  get tableData(): ListQueryRespType<unknown> {

    return this._tableData;

  }

  set tableData(tableData: ListQueryRespType<unknown>) {

    this._tableData = tableData;
    this.dataSource.data = tableData.items;
    this.totalItems = tableData.totalItems;
    this.pageIndex = tableData.pageIndex;

  }

  displayedColumnsO: Array<string>;

  @Input()
  get displayedColumns(): Array<string> {

    return this.displayedColumnsO;

  }

  set displayedColumns(displayedColumnsP: Array<string>) {

    this.displayedColumnsO = displayedColumnsP;
    this.displayedColumnsS = [ 'select', ...this.displayedColumns ];

  }

  @Input() loading:boolean;

  @Input() editUri: string;

  @Input() deleteUri: string;

  @Input() columnParsingFn?:(elm:unknown, clm:string)=>string;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  extraColumns: Array<string>;

  dataSource = new MatTableDataSource<unknown>([]);

  pageSizeOptions:Array<number> = PAGE_SIZE_OPTIONS;

  expandedElement: unknown | null;

  queryParams:QueryData = { };

  selection = new SelectionModel<unknown>(true, []);

  displayedColumnsS: Array<string>;

  @Input() filterItem: FilterItem;

  @ViewChild(TableFilterDirective, {static: true}) filterHost!: TableFilterDirective;

  constructor(private router:Router,
    private activatedRoute: ActivatedRoute,
    private readonly mainService: MainService,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {

    if (this.isAllSelected()) {

      this.selection.clear();
      return;

    }

    this.selection.select(...this.dataSource.data);

  }

  private loadComponent = () => {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.filterItem.component);

    const {viewContainerRef} = this.filterHost;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<FilterComponent>(componentFactory);
    componentRef.instance.data = this.filterItem.data;

  };

  ngOnInit():void {

    this.activatedRoute.queryParams.subscribe((value) => {

      this.queryParams = value;

    });
    this.loadComponent();


    if (this.mainService.isMobileView()) {

      const COLUMN_COUNT_MOBILE_VIEW = 3;
      this.extraColumns = this.displayedColumns;
      this.displayedColumns = this.extraColumns.splice(0, COLUMN_COUNT_MOBILE_VIEW);

    }


  }

  ngAfterViewInit():void {

    // eslint-disable-next-line no-underscore-dangle
    this.paginator._intl.itemsPerPageLabel = 'Rows per page';
    if (this.mainService.isMobileView()) {

      // eslint-disable-next-line no-underscore-dangle
      this.paginator._intl.itemsPerPageLabel = '';

    }
    this.paginator.page.subscribe((evt: PageEvent) => {

      this.queryParams.limit = evt.pageSize;
      this.queryParams.offset = evt.pageIndex * evt.pageSize;
      this.router.navigate([], { queryParams: this.queryParams });

    });
    this.sort.sortChange.subscribe((cSort:Sort) => {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {order, ...otherParams} = this.queryParams;
      if (cSort.direction) {

        this.queryParams = {...otherParams,
          order: [ `${cSort.active} ${cSort.direction}` ]};

      } else {

        this.queryParams = {...otherParams};

      }

      this.router.navigate([], { queryParams: this.queryParams });

    });

  }

  editSelected = (): void => {

    const [ selectedTax ] = <Array<Tax>> this.selection.selected;
    this.router.navigate([ this.editUri ], { queryParams: {id: selectedTax.id,
      burl: this.router.url} });

  }

  deleteSelected = (): void => {

    const selectedTaxes = <Array<Tax>> this.selection.selected;
    const ids = [];
    selectedTaxes.forEach((taxP) => ids.push(taxP.id));
    this.router.navigate([ this.deleteUri ], { queryParams: {ids: ids.join(),
      burl: this.router.url} });

  }

  findCssClass = (cName:string):string => {

    if (this.numberColumns.includes(cName)) {

      return 'column-right-align';

    }
    return '';

  }

  findArrowPos = (cName:string):string => {

    if (this.numberColumns.includes(cName)) {

      return 'before';

    }
    return 'after';

  }

}
