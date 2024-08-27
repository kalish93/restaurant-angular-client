import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { StockFacade } from 'src/app/restaurant/facades/stock.facae';
import { AddStockModalComponent } from '../add-stock-modal/add-stock-modal.component';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';

interface StockListComponentState {
  stocks: any;
}

const initStockListComponentState: Partial<StockListComponentState> = {
  stocks: undefined,
}

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent implements OnInit{

  displayedColumns: string[] = ['image', 'name', 'quantity', 'actions'];

  $stocks = this.state.select('stocks');
  stocks : any[] = [];
  pageNumber = 1;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private stockFacade: StockFacade,
    private state: RxState<StockListComponentState>,
    private dialog: MatDialog
  ){
    this.state.set(initStockListComponentState);
    this.state.connect('stocks', this.stockFacade.stocks$);
  }

  ngOnInit(): void {
    this.stockFacade.dispatchGetStocks(this.pageNumber, this.pageSize);
    this.$stocks.subscribe((data)=>{
      this.stocks = data.items;
      this.pageNumber = data.pageNumber;
      this.pageSize = data.pageSize;
      this.paginator.length = data.totalCount;
    })
  }

  pageChanged(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.stockFacade.dispatchGetStocks(this.pageNumber, this.pageSize);
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  openAddStockDialog(): void {
    const dialogRef = this.dialog.open(AddStockModalComponent, {
      width: '400px',
      data: {} // You can pass data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openEditStockDialog(stock: any, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(AddStockModalComponent, {
      width: '400px',
      data: { stock }  // Pass the restaurant data for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  deleteStock(stockId: string, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this stock?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.stockFacade.dispatchDeleteStock(stockId);
      }
    });
  }

}
