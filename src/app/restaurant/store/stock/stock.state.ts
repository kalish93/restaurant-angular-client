import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import {
  insertItem,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { successStyle } from 'src/app/core/services/operation-status/status-style-names';

import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { StockService } from '../../services/stock.service';
import { CreateStock, DeleteStock, GetStocks, UpdateStock } from './stock.actions';

export interface StockStateModel {
  stocks: PaginatedList<any>;
  // selectedStock: any;
}

const STOCK_STATE_TOKEN = new StateToken<StockStateModel>(
  'StockState'
);

const defaults = {
  stocks: {
    items: [],
    pageNumber: 0,
    totalPages: 0,
    totalCount: 0,
  },
  // selectedStock: null
};

@State<StockStateModel>({
  name: STOCK_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class StockState {
  constructor(
    private stockService: StockService,
    private operationStatus: OperationStatusService,
    private store: Store
  ) {}

  @Action(GetStocks)
  getStocks(
    { setState }: StateContext<StockStateModel>,
    { pageNumber, pageSize }: GetStocks
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.stockService.getStocks(pageNumber, pageSize).pipe(
      tap((result) => {
        setState(
          patch({
            stocks: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(CreateStock)
createStock(
  { setState, getState }: StateContext<StockStateModel>,
  { data }: CreateStock
) {
  this.store.dispatch(new SetProgressOn());
  return this.stockService.createStock(data).pipe(
    tap((result) => {
      const state = getState();

      setState(
        patch({
          stocks: {
            ...state.stocks,
            items: [...state.stocks.items, result],
            totalCount: state.stocks.totalCount + 1,
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Stock item added successfully!',
        successStyle,);
    })
  );
}

@Action(UpdateStock)
updateStock(
  { setState, getState }: StateContext<StockStateModel>,
  { id, data }: UpdateStock
) {
  this.store.dispatch(new SetProgressOn());
  return this.stockService.updateStock(id,data).pipe(
    tap((updatedStock) => {
      const state = getState();

      const updatedItems = state.stocks.items.map((item) =>
        item.id === id ? updatedStock : item
      );

      setState(
        patch({
          stocks: {
            ...state.stocks,
            items: updatedItems, // Update the specific Stock in the list
          },
        })
      );

      this.store.dispatch(new SetProgressOff());
      // Display a success message
      this.operationStatus.displayStatus(
        'Stock updated successfully!',
        successStyle,
      );
    })
  );
}

@Action(DeleteStock)
deleteStock(
  { setState, getState }: StateContext<StockStateModel>,
  { id }: DeleteStock
) {
  this.store.dispatch(new SetProgressOn());
  return this.stockService.deleteStock(id).pipe(
    tap(() => {
      const state = getState();

      const filteredItems = state.stocks.items.filter(
        (item) => item.id !== id
      );

      setState(
        patch({
          stocks: {
            ...state.stocks,
            items: filteredItems, // Remove the Stock from the list
            totalCount: state.stocks.totalCount - 1, // Update the total count
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Stock deleted successfully!',
        successStyle,
      );
    })
  );
}

}

