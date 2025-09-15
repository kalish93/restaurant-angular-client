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
  styleUrl: './table-list.component.scss'
})
export class TableListComponent implements OnInit{

  $tables = this.state.select('tables');
  tables: any[] = [];
  selectedStatusFilter: string | null = null;
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
  get filteredTables() {
    if (!this.selectedStatusFilter) {
      return this.tables;
    }
    return this.tables.filter(table => table.status === this.selectedStatusFilter);
  }

  setStatusFilter(status: string | null) {
    this.selectedStatusFilter = status;
  }

  getFilterButtonClass(status: string | null): string {
    const baseClasses = "rounded-full px-6 py-2.5 text-sm font-medium transition-all";
    
    if (this.selectedStatusFilter === status) {
      return `${baseClasses} bg-white text-blue-600 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    } else {
      return `${baseClasses} bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    }
  }

  onImageError(event: any) {
    event.target.src = '/placeholder.svg?height=112&width=112&text=QR';
  }
}
