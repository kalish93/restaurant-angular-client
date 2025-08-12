import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from '../../facades/menu.facade';
import { Menu } from '../../models/menu.model';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { StockSelectionComponent } from '../menu/stock-selection/stock-selection.component';
import { Roles } from 'src/app/core/constants/roles';

interface MenuState {
  menus: Menu[];
}

const initMenuState: MenuState = {
  menus: []
};

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  menus$ = this.state.select('menus');

  constructor(
    private dialog: MatDialog,
    private menuFacade: MenuFacade,
    private state: RxState<MenuState>
  ) {
    this.state.set(initMenuState);
    this.state.connect('menus', this.menuFacade.menus$);
  }

  ngOnInit(): void {
    this.menuFacade.dispatchGetMenus();
    this.menus$.subscribe((item) => {
      this.menus = item;
    });
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  openMenuModal(): void {
    const dialogRef = this.dialog.open(StockSelectionComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.type === 'stock') {
        this.openStockBasedMenuForm(result.stockItem);
      } else if (result?.type === 'new') {
        this.openNewMenuItemForm();
      }
    });
  }

  openStockBasedMenuForm(stockItem: any): void {
    this.dialog.open(MenuFormComponent, {
      width: '500px',
      data: { stockItem }
    });
  }

  openNewMenuItemForm(): void {
    this.dialog.open(MenuFormComponent, {
      width: '500px'
    });
  }

  deleteMenuItem(item: Menu): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this menu item?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.menuFacade.dispatchDeleteMenu(item.id);
      }
      this.dialog.closeAll();
    });
  }

  editMenuItem(editableItem: Menu): void {
    this.dialog.open(MenuFormComponent, {
      width: '500px',
      data: {editableItem}
    });
  }

  hasManagerRole(){
    return Roles.RestaurantManager
  }

  onImageError(event: any) {
    event.target.src = 'https://placehold.co/600x400?text=Menu+Image';
  }
}
