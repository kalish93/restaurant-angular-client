import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StockSelector } from '../store/stock/stock.selectors';
import { CreateStock, GetStocks } from '../store/stock/stock.actions';



@Injectable({
  providedIn: 'root',
})
export class StockFacade {
  stocks$: Observable<any> = this.store.select(StockSelector.slices.stocks);

  constructor(private store: Store) {}

  dispatchGetStocks(pageNumber: any, pageSize: any) {
    this.store.dispatch(new GetStocks(pageNumber, pageSize));
  }

  dispatchCreateStock(data: FormData) {
    this.store.dispatch(new CreateStock(data));
  }
}
