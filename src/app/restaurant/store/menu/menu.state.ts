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
import { Menu } from '../../models/menu.model';
import { CreateMenu, DeleteMenu, GetMenuByRestaurant, GetMenus, UpdateMenu } from './menu.actions';
import { MenuService } from '../../services/menu.service';

export interface MenuStateModel {
  menus: Menu[];
}

const MENU_STATE_TOKEN = new StateToken<MenuStateModel>('menuState');

const defaults = {
  menus: [],
};

@State<MenuStateModel>({
  name: MENU_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class MenuState {
  constructor(
    private operationStatus: OperationStatusService,
    private store: Store,
    private menuService: MenuService
  ) {}

  @Action(GetMenus)
  getRestaurants({ setState }: StateContext<MenuStateModel>, {}: GetMenus) {
    this.store.dispatch(new SetProgressOn());
    return this.menuService.getMenus().pipe(
      tap((result) => {
        setState(
          patch({
            menus: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(CreateMenu)
  createMenu(
    { setState, patchState }: StateContext<MenuStateModel>,
    { data }: CreateMenu
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.menuService.createMenu(data).pipe(
      tap((result) => {
        setState(
          patch({
            menus: insertItem(result),
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Menu item created successfully!',
          successStyle
        );
      })
    );
  }

  @Action(UpdateMenu)
  updateMenu(
    { setState, patchState }: StateContext<MenuStateModel>,
    { menuId, data }: UpdateMenu
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.menuService.updateMenu(menuId, data).pipe(
      tap((result) => {
        setState(
          patch({
            menus: updateItem((item) => item.id === result.id, result),
          })
        );
        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Menu item updated successfully!',
          successStyle
        );
      })
    );
  }

  @Action(DeleteMenu)
  deleteMenu(
    { setState, patchState }: StateContext<MenuStateModel>,
    { id }: DeleteMenu
  ) {
    return this.menuService.deleteMenu(id).pipe(
      tap((result) => {
        setState(
          patch({
            menus: removeItem((item) => item.id === result.id),
          })
        );
        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Menu item deleted successfully!',
          successStyle
        );
      })
    );
  }

  @Action(GetMenuByRestaurant)
  getMenuByRestaurant({ setState }: StateContext<MenuStateModel>, {restaurantId}: GetMenuByRestaurant) {
    this.store.dispatch(new SetProgressOn());
    return this.menuService.getMenuByRestaurant(restaurantId).pipe(
      tap((result) => {
        setState(
          patch({
            menus: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

}
