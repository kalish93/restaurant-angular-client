import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { Cart, Menu } from 'src/app/restaurant/models/menu.model';

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
  selectedTable: {}
};

@Component({
  selector: 'app-menu-list-for-users',
  templateUrl: './menu-list-for-users.component.html',
  styleUrls: ['./menu-list-for-users.component.scss'],
  providers: [RxState]
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

  constructor(
    private state: RxState<MenuListForUsersComponentState>,
    private restaurantFacade: RestaurantFacade,
    private menuFacade: MenuFacade,
    private route: ActivatedRoute,
    private router: Router,
    private orderFacade: OrderFacade
  ) {
    this.state.set(initMenuListForUsersComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$)
    this.state.connect('menus', this.menuFacade.menus$)
    this.state.connect('cart', this.orderFacade.cart$)
    this.state.connect('selectedTable', this.restaurantFacade.selectedTable$)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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

    this.cart$.subscribe((data)=>{
      this.cart = data;
      this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    })
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  order(item: Menu): void {
    const quantity = 1; // Default quantity, you may want to get this from user input

  // Dispatch action to add item to cart with quantity
  this.orderFacade.dispatchAddToCart({ menuItem: item, quantity, showInstructions: false });

  // Update local cart count (if needed for UI updates)
  this.cartItems.push(item);
  this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
  ;
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

  viewOrders(){
    this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
  }
}

