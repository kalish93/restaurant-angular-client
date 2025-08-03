import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { StockFacade } from 'src/app/restaurant/facades/stock.facae';

interface StockSelectionComponentState  {
  stocks: PaginatedList<any> | null;
}

const initStockSelectionComponentState : StockSelectionComponentState = {
  stocks: null
}

@Component({
    selector: 'app-stock-selection',
    templateUrl: './stock-selection.component.html',
    styleUrls: ['./stock-selection.component.scss'],
    providers: [RxState],
    standalone: false
})
export class StockSelectionComponent implements OnInit{
  stockItems: any[] = [];
  selectedStockItem: any;

  $stocks = this.state.select('stocks');

  constructor(
    private dialogRef: MatDialogRef<StockSelectionComponent>,
    private stockFacade: StockFacade,
    private state: RxState<StockSelectionComponentState>
  ) {
    this.state.set(initStockSelectionComponentState);
    this.state.connect('stocks', this.stockFacade.stocks$);
  }

  ngOnInit(): void {
    this.stockFacade.dispatchGetStocks();
    this.$stocks.subscribe((data)=>{
      this.stockItems = data!.items;
    })
  }

  selectFromStock(): void {
    this.dialogRef.close({ type: 'stock', stockItem: this.selectedStockItem });
  }

  createNewItem(): void {
    this.dialogRef.close({ type: 'new' });
  }
}
