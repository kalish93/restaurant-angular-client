import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { Menu } from '../../models/menu.model';
import { CreateMenu, GetMenus } from './menu.actions';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { MenuService } from '../../services/menu.service';

export interface MenuStateModel {
  menus: Menu[]
}

const MENU_STATE_TOKEN = new StateToken<MenuStateModel>(
  'MenuState'
);

const defaults: MenuStateModel = {
  menus:[]
};

@State<MenuStateModel>({
  name: MENU_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class MenuState {
  constructor(
    private menuService: MenuService,
    private operationStatus: OperationStatusService,
    private store: Store
  ) {}

  @Action(GetMenus)
  getMenus(
    { setState }: StateContext<MenuStateModel>,
    {}: GetMenus
  ) {
    
      this.menuService.getMenus().pipe(
        tap((result) => {
            setState({
              menus:result
            })
        })
      );
    }

  @Action(CreateMenu)
  createMenu(
    { setState, patchState}: StateContext<MenuStateModel>,
    {data}: CreateMenu
  ) {
      this.menuService.createMenu(data).pipe(
        tap((result) => {
          setState(
            patch({
            menus:insertItem(result)  
          }));
        })
      ).subscribe();
    }
}
