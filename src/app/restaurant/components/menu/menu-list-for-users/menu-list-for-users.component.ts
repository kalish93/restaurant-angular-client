import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { MatDialog } from '@angular/material/dialog';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { NotificationFacade } from 'src/app/core/facades/notification.facade';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { Cart, Menu } from 'src/app/restaurant/models/menu.model';
import { CartModalComponent } from '../cart-modal/cart-modal.component';

interface MenuListForUsersComponentState {
  restaurant: any;
  menus: Menu[];
  cart: Cart[];
  selectedTable: any;
}

const initMenuListForUsersComponentState: MenuListForUsersComponentState = {
  restaurant: null,
  menus: [],
  cart: [],
  selectedTable: {},
};

@Component({
  selector: 'app-menu-list-for-users',
  templateUrl: './menu-list-for-users.component.html',
  styleUrls: ['./menu-list-for-users.component.scss'],
  providers: [RxState],
})
export class MenuListForUsersComponent implements OnInit {
  $restaurant = this.state.select('restaurant');
  restaurant: any = null;
  restaurantId: string | null = null;
  tableId: string | null = null;
  menus: Menu[] = [];
  menus$ = this.state.select('menus');
  cart$ = this.state.select('cart');
  cart: Cart[] = [];
  cartItems: Menu[] = [];
  cartCount = 0;

  categorizedMenus: { [category: string]: Menu[] } = {};
  selectedTable$ = this.state.select('selectedTable');
  selectedTable: any = {};
  selectedCategory: string | null = null;

  // Special instructions for each menu item
  specialInstructions: { [menuItemId: string]: string } = {};
  showInstructionsFor: { [menuItemId: string]: boolean } = {};

  constructor(
    private state: RxState<MenuListForUsersComponentState>,
    private restaurantFacade: RestaurantFacade,
    private menuFacade: MenuFacade,
    private route: ActivatedRoute,
    private router: Router,
    private orderFacade: OrderFacade,
    private notificationFacade: NotificationFacade,
    private dialog: MatDialog
  ) {
    this.state.set(initMenuListForUsersComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$);
    this.state.connect('menus', this.menuFacade.menus$);
    this.state.connect('cart', this.orderFacade.cart$);
    this.state.connect('selectedTable', this.restaurantFacade.selectedTable$);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.restaurantId = params.get('restaurantId');
      this.tableId = params.get('tableId');
      this.restaurantFacade.dispatchGetRestaurant(this.restaurantId);
      this.menuFacade.dispatchGetMenuByRestaurant(this.restaurantId);
      this.restaurantFacade.dispatchGetTable(this.tableId);
    });

    this.$restaurant.subscribe((data) => {
      this.restaurant = data;
    });

    this.menus$.subscribe((data) => {
      this.menus = data;
      this.categorizeMenus();
    });

    this.selectedTable$.subscribe((data) => {
      this.selectedTable = data;
    });

    this.cart$.subscribe((data) => {
      this.cart = data;
      this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  addToCart(item: Menu) {
    this.cartItems.push(item);
    const specialInstructions = this.specialInstructions[item.id] || '';
    this.orderFacade.dispatchAddToCart({
      menuItem: item,
      quantity: 1,
      showInstructions: this.showInstructionsFor[item.id] || false,
      specialInstructions: specialInstructions,
    });
  }

  toggleSpecialInstructions(itemId: string) {
    this.showInstructionsFor[itemId] = !this.showInstructionsFor[itemId];
    if (!this.showInstructionsFor[itemId]) {
      this.specialInstructions[itemId] = '';
    }

    // Force layout recalculation for masonry after DOM update
    setTimeout(() => {
      // This helps the browser recalculate the masonry layout
      const container = document.querySelector('.masonry-container');
      if (container) {
        (container as HTMLElement).style.columns = (
          container as HTMLElement
        ).style.columns;
      }
    }, 50);
  }

  updateSpecialInstructions(itemId: string, instructions: string) {
    this.specialInstructions[itemId] = instructions;
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  get availableCategories(): string[] {
    return Object.keys(this.categorizedMenus);
  }

  get filteredMenus() {
    if (!this.selectedCategory) {
      return this.menus;
    }
    return this.menus.filter(
      (menu) => menu.category.name === this.selectedCategory
    );
  }

  setCategoryFilter(category: string | null) {
    this.selectedCategory = category;
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

  navigateToCart(): void {
    this.router.navigate([`/cart/${this.restaurantId}/${this.tableId}`]); // Navigate to the cart detail page
  }

  categorizeMenus(): void {
    this.categorizedMenus = this.menus.reduce((acc, item) => {
      const category = item.category?.name || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [category: string]: Menu[] });
  }

  viewOrders() {
    this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
  }

  callWaiter() {
    const dataToSend = {
      restaurantId: this.restaurantId,
      tableId: this.tableId,
    };
    this.notificationFacade.dispatchCallWaiter(dataToSend);
  }

  requestPayment() {
    this.orderFacade.dispatchRequestPayment(this.tableId);
  }

  openCartModal() {
    this.dialog.open(CartModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'cart-modal-panel',
      hasBackdrop: true,
      disableClose: false,
    });
  }
}
