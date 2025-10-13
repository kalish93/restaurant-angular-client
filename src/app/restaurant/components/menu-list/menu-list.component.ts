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
import { CategoryFacade } from '../../facades/category.facade';

interface MenuState {
  menus: Menu[];
  selectedRestaurant: any;
  categories: any[];
}

const initMenuState: MenuState = {
  menus: [],
  selectedRestaurant: null,
  categories: [],
};

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  menus$ = this.state.select('menus');
  selectedRestaurant$ = this.state.select('selectedRestaurant');
  selectedRestaurant: any = null;
  categories: any[] = [];
  categories$ = this.state.select('categories');
  searchTerm: string = '';
  selectedCategory: string = ''; // Hold the selected category ID or '' for all
  filteredMenus: Menu[] = [];
  categorizedMenus: { [category: string]: Menu[] } = {};

  constructor(
    private dialog: MatDialog,
    public menuFacade: MenuFacade,
    private state: RxState<MenuState>,
    private restaurantFacade: RestaurantFacade,
    private categoryFacade: CategoryFacade
  ) {
    this.state.set(initMenuState);
    this.state.connect('menus', this.menuFacade.menus$);
    this.state.connect(
      'selectedRestaurant',
      this.restaurantFacade.selectedRestaurant$
    );
    this.state.connect('categories', this.categoryFacade.categories$);
  }

  ngOnInit(): void {
    this.menuFacade.dispatchGetMenus();
    this.menus$.subscribe((item) => {
      this.menus = item;
      this.categorizeMenus(); // <-- categorize menus
      this.applyFilters();
    });
    this.selectedRestaurant$.subscribe((item) => {
      this.selectedRestaurant = item;
    });
    this.filteredMenus = [...this.menus];
    this.categoryFacade.dispatchGetCategoriesByRestaurant(
      this.selectedRestaurant?.id
    );
    this.categories$.subscribe((items) => {
      this.categories = items;
    });
  }

  getImageUrl(imagePath: string): string {
    return `${MEDIA_URL}/${imagePath}`;
  }

  openMenuModal(): void {
    const dialogRef = this.dialog.open(MenuFormComponent, {
      width: '500px',
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
      width: '480px',
    });
  }

  openStockBasedMenuForm(stockItem: any): void {
    this.dialog.open(MenuFormComponent, {
      width: '500px',
      data: { stockItem },
    });
  }

  openNewMenuItemForm(): void {
    this.dialog.open(MenuFormComponent, {
      width: '500px',
    });
  }

  deleteMenuItem(item: Menu): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this menu item?',
      },
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
      data: { editableItem },
    });
  }

  hasManagerRole() {
    return Roles.RestaurantManager;
  }

  onImageError(event: any) {
    event.target.src = 'https://placehold.co/600x400?text=Menu+Image';
  }

  confirmToggleAvailability(item: Menu): void {
    const newStatus = item.status === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to set "${
          item.name
        }" as ${newStatus.replace('_', ' ')}?`,
      },
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
      data: { qrImageUrl: this.getQrImageUrl() },
    });
  }

  downloadMenuQr(): void {
    this.restaurantFacade.dispatchDownloadMenuQrCode();
  }

  applyFilters(): void {
    let tempMenus = [...this.menus]; // Start with the full list

    // 1. Filter by Search Term
    if (this.searchTerm) {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      tempMenus = tempMenus.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseSearch) ||
          item.ingredients.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. Filter by Category
    if (this.selectedCategory) {
      tempMenus = tempMenus.filter(
        (item) => item.category.name === this.selectedCategory
      );
    }

    // Update the list displayed in the template
    this.filteredMenus = tempMenus;
  }

  setCategoryFilter(category: string | null) {
    this.selectedCategory = category as string;
    this.applyFilters(); // <-- add this
  }

  getFilterButtonClass(category: string | null): string {
    const baseClasses =
      'rounded-full px-6 py-2.5 text-sm font-medium transition-all';

    if (this.selectedCategory === category) {
      return `${baseClasses} bg-white text-blue-600 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    } else {
      return `${baseClasses} bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    }
  }

  categorizeMenus(): void {
    this.categorizedMenus = this.menus.reduce((acc, item) => {
      const category = item.category?.name || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as { [category: string]: Menu[] });
  }

  get availableCategories(): string[] {
    return Object.keys(this.categorizedMenus);
  }
}
