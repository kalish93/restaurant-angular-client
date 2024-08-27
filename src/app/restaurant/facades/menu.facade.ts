import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetMenus, CreateMenu, DeleteMenu, UpdateMenu, GetMenuByRestaurant } from '../store/menu/menu.actions';
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
  dispatchDeleteMenu(id: string){
    this.store.dispatch(new DeleteMenu(id));
  }
  dispatchUpdateMenu(menuId:string, data:FormData){
    this.store.dispatch(new UpdateMenu(menuId,data));
  }

  dispatchGetMenuByRestaurant(restaurantId:any){
    this.store.dispatch(new GetMenuByRestaurant(restaurantId));
  }
}
