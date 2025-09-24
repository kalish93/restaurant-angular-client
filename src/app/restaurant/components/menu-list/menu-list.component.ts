import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from '../../facades/menu.facade';
import { Menu } from '../../models/menu.model';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { StockSelectionComponent } from '../menu/stock-selection/stock-selection.component';
import { Roles } from 'src/app/core/constants/roles';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { MenuQrDialogComponent } from '../menu-qr-dialog/menu-qr-dialog.component';

interface MenuState {
  menus: Menu[];
  selectedRestaurant: any;
}

const initMenuState: MenuState = {
  menus: [],
  selectedRestaurant: null
};

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  menus$ = this.state.select('menus');
  selectedRestaurant$ = this.state.select('selectedRestaurant');
  selectedRestaurant: any= null;


  constructor(
    private dialog: MatDialog,
    public menuFacade: MenuFacade,
    private state: RxState<MenuState>,
    private restaurantFacade: RestaurantFacade
  ) {
    this.state.set(initMenuState);
    this.state.connect('menus', this.menuFacade.menus$);
    this.state.connect('selectedRestaurant', this.restaurantFacade.selectedRestaurant$);
  }

  ngOnInit(): void {
    this.menuFacade.dispatchGetMenus();
    this.menus$.subscribe((item) => {
      this.menus = item;
    });
    this.selectedRestaurant$.subscribe((item) => {
      this.selectedRestaurant = item;
    });
  }

  getImageUrl(imagePath: string): string {
    return `${MEDIA_URL}/${imagePath}`;
  }

  openMenuModal(): void {
    const dialogRef = this.dialog.open(MenuFormComponent, {
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

  openCategoryManager(): void {
    this.dialog.open(CategoryManagerComponent, {
      width: '480px'
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

confirmToggleAvailability(item: Menu): void {
  const newStatus = item.status === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: `Are you sure you want to set "${item.name}" as ${newStatus.replace('_', ' ')}?`
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'confirm') {
      this.menuFacade.dispatchUpdateMenuAvailability(item.id, newStatus);
    }
  });
}

//  generateMenuQr(): void {
//     this.restaurantFacade.dispatchGenerateMenuQrCode(this.selectedRestaurant.id);
//   }

  getQrImageUrl(): string | null {
    return this.selectedRestaurant.qrCodeImage;
  }

  // viewMenuQr(): void {
  //   return this.selectedRestaurant.qrCodeImage;

  // }

  viewMenuQr(): void {
  this.dialog.open(MenuQrDialogComponent, {
    width: '420px',
    data: { qrImageUrl: this.getQrImageUrl() }
  });
}


  downloadMenuQr(): void {
    this.restaurantFacade.dispatchDownloadMenuQrCode()
  }
}
