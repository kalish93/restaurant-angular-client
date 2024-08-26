import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StockSelector } from '../store/stock/stock.selectors';
import { CreateStock, GetStocks } from '../store/stock/stock.actions';
import { GetMenus, CreateMenu } from '../store/menu/menu.actions';
import { MenuSelector } from '../store/menu/menu.selectors';



@Injectable({
  providedIn: 'root',
})
export class MenuFacade {
  menus$: Observable<any> = this.store.select(MenuSelector.slices.menus);

  constructor(private store: Store) {}

  dispatchGetMenus() {
    this.store.dispatch(new GetMenus());
  }

  dispatchCreateMenu(data: FormData) {
    this.store.dispatch(new CreateMenu(data));
  }
}
