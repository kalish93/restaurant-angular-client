import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Cart, Menu } from 'src/app/restaurant/models/menu.model';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';

interface CartComponentState {
  cart: Cart[];
}

const initCartComponentState: CartComponentState = {
  cart: [],
};

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [RxState]
})
export class CartComponent implements OnInit {

  cart$ = this.state.select('cart');
  cart: Cart[] = [];
  restaurantId: string | null = null;
  tableId: string | null = null;


  constructor(
    private state: RxState<CartComponentState>,
    private menuFacade: MenuFacade,
    private router: Router,
    private route: ActivatedRoute,
    private orderFacade: OrderFacade
  ) {
    this.state.set(initCartComponentState);
    this.state.connect('cart', this.orderFacade.cart$);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.restaurantId = params.get('restaurantId');
      this.tableId = params.get('tableId');
    });
    this.cart$.subscribe(data => {
      this.cart = data || [];
    });
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  updateQuantity(item: Cart, event: any): void {
    const newQuantity = event.target.value;
    if (newQuantity > 0) {
      // Update the quantity of the item in the cart
      item.quantity = newQuantity;
      // You may also want to update the cart in the global state
      this.orderFacade.dispatchUpdateCart(this.cart); // Assuming you have an updateCart method in your facade
    }
  }

  removeFromCart(item: Cart): void {
    // Logic to remove item from cart
    this.cart = this.cart.filter(cartItem => cartItem.menuItem.id !== item.menuItem.id);
    this.orderFacade.dispatchUpdateCart(this.cart); // Update the cart in the global state
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }

  order(): void {
    if(this.cart.length > 0){
      const dataToSend = {
        restaurantId: this.restaurantId,
        tableId: this.tableId,
        items: this.cart
      }

      this.orderFacade.dispatchPlaceOrder(dataToSend, this.tableId);
    }
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
    this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);

  }
}
