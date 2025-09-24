import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { MatDialog } from '@angular/material/dialog';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { NotificationFacade } from 'src/app/core/facades/notification.facade';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { Cart, Menu } from 'src/app/restaurant/models/menu.model';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { EnterOrderNumberModalComponent } from '../enter-order-number-modal/enter-order-number-modal.component';

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
  searchTerm: string = '';

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

      if (this.tableId) {
        this.restaurantFacade.dispatchGetTable(this.tableId);
        this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
      } else {
        // Get orders for restaurant when no table ID
        // this.orderFacade.dispatchGetActiveRestaurantOrder(this.restaurantId);
        // Ensure cart is empty when not ordering for a specific table
        this.orderFacade.dispatchUpdateCart([]);
      }
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
    this.orderFacade.dispatchAddToCart({
      menuItem: item,
      quantity: 1,
      showInstructions: false,
    });
  }

  checkIfItemInCart(item: Menu): boolean {
    return this.cart.some((cartItem) => cartItem.menuItem.id === item.id);
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  getImageUrl(imagePath: string): string {
    return `${MEDIA_URL}/${imagePath}`;
  }

  get availableCategories(): string[] {
    return Object.keys(this.categorizedMenus);
  }

  get filteredMenus() {
    let result = this.menus;
    if (this.selectedCategory) {
      result = result.filter((menu) => menu.category.name === this.selectedCategory);
    }
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      const q = this.searchTerm.trim().toLowerCase();
      result = result.filter((menu) =>
        (menu.name?.toLowerCase().includes(q)) ||
        (menu.ingredients?.toLowerCase().includes(q)) ||
        (menu.category?.name?.toLowerCase().includes(q))
      );
    }
    return result;
  }

  setCategoryFilter(category: string | null) {
    this.selectedCategory = category;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
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

  // viewOrders() {
  //   if (this.tableId) {
  //     this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
  //   } else {
  //     this.router.navigate([`/orders/${this.restaurantId}`]);
  //   }
  // }
  viewOrders() {
  if (!this.tableId) {
    // Open modal for order number input
    const dialogRef = this.dialog.open(EnterOrderNumberModalComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((orderNumber) => {
      if (orderNumber) {
        // Dispatch action to fetch order by number
        this.orderFacade.dispatchGetOrderByNumber(this.restaurantId, orderNumber);
        this.router.navigate([`/orders/${this.restaurantId}`], {
          queryParams: { orderNumber },
        });
      }
    });
  } else {
    // Premium or table exists

      this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);

  }
}

  callWaiter() {
    if (this.tableId) {
      const dataToSend = {
        restaurantId: this.restaurantId,
        tableId: this.tableId,
      };
      this.notificationFacade.dispatchCallWaiter(dataToSend);
    }
  }

  requestPayment() {
    if (this.tableId) {
      this.orderFacade.dispatchRequestPayment(this.tableId);
    }
  }

  openCartModal() {
    this.dialog.open(CartModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'cart-modal-panel',
      hasBackdrop: true,
      disableClose: false,
      data: {
        restaurantId: this.restaurantId,
        tableId: this.tableId,
      },
    });
  }
}
