import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { TableFormComponent } from '../table-form/table-form.component';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { Roles } from 'src/app/core/constants/roles';
import { Router } from '@angular/router';
import { TABLE_LIST } from 'src/app/core/constants/routes';

interface TableListComponentState {
  tables: any[];
}

const initTableListComponentState: Partial<TableListComponentState> = {
  tables: [],
};

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrl: './table-list.component.scss',
    standalone: false
})
export class TableListComponent implements OnInit{

  $tables = this.state.select('tables');
  tables: any[] = [];
  constructor(
    private state: RxState<TableListComponentState>,
    private restaurantFacade: RestaurantFacade,
    private dialog: MatDialog,
    private router: Router
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


  openEditRestaurantDialog(table: any, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(TableFormComponent, {
      width: '400px',
      data: { table }  // Pass the restaurant data for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  deleteRestaurant(tableId: string, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this table?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.restaurantFacade.dispatchDeleteTable(tableId);
      }
    });
  }

  viewTableOrders(id: string){
    this.router.navigate([`/home/${TABLE_LIST}/${id}`])
  }
  hasManagerRole(){
    return Roles.RestaurantManager
  }
  
  hasWaiterRole(){
    return Roles.Waiter
  }
}
