import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { TableFormComponent } from '../table-form/table-form.component';

interface TableListComponentState {
  tables: any[];
}

const initTableListComponentState: Partial<TableListComponentState> = {
  tables: [],
};

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.scss'
})
export class TableListComponent implements OnInit{

  $tables = this.state.select('tables');
  tables: any[] = [];
  constructor(
    private state: RxState<TableListComponentState>,
    private restaurantFacade: RestaurantFacade,
    private dialog: MatDialog,
  ){
    this.state.set(initTableListComponentState);
    this.state.connect('tables', this.restaurantFacade.tables$);
  }

  ngOnInit(): void {
    this.restaurantFacade.dispatchGetTables();
    this.$tables.subscribe((data) =>{
      this.tables = data;
    })
  }

  openAddTableDialog(): void {
    const dialogRef = this.dialog.open(TableFormComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restaurantFacade.dispatchGetTables();
      }
    });
  }

  downloadQRCode(tableId: string, tableNumber: any): void {
    this.restaurantFacade.dispatchDowloadQrCode(tableId, tableNumber);
  }
}
