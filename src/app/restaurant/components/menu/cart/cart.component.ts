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
  providers: [RxState],
})
export class CartComponent implements OnInit {
  cart$ = this.state.select('cart');
  cart: Cart[] = [];
  restaurantId: string | null = null;
  tableId: string | null = null;

  // Discount properties
  discountCode: string = '';
  discountPercent: number = 0;

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
    this.route.paramMap.subscribe((params) => {
      this.restaurantId = params.get('restaurantId');
      this.tableId = params.get('tableId');
    });
    this.cart$.subscribe((data) => {
      console.log(data);
      this.cart = data || [];
    });
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      // Update the quantity of the item in the cart
      this.cart[index].quantity = newQuantity;
      // Update the cart in the global state
      this.orderFacade.dispatchUpdateCart(this.cart);
    }
  }

  removeFromCart(item: Cart): void {
    // Logic to remove item from cart
    this.cart = this.cart.filter(
      (cartItem) => cartItem.menuItem.id !== item.menuItem.id
    );
    this.orderFacade.dispatchUpdateCart(this.cart); // Update the cart in the global state
  }

  getSubtotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  }

  getTaxBreakdown(): {
    itemName: string;
    taxRate: number;
    taxAmount: number;
  }[] {
    return this.cart.map((item) => {
      const itemSubtotal = item.menuItem.price * item.quantity;
      const taxAmount = itemSubtotal * (item.menuItem.taxRate / 100);
      return {
        itemName: item.menuItem.name,
        taxRate: parseFloat(item.menuItem.taxRate.toString()), // Convert to percentage
        taxAmount: taxAmount,
      };
    });
  }

  getTotalTax(): number {
    return this.cart.reduce((totalTax, item) => {
      const itemSubtotal = item.menuItem.price * item.quantity;
      const itemTax = itemSubtotal * (item.menuItem.taxRate / 100);
      return totalTax + itemTax;
    }, 0);
  }

  getDiscountAmount(): number {
    return this.getSubtotal() * (this.discountPercent / 100);
  }

  hasDiscount(): boolean {
    return this.discountCode !== '' && this.discountPercent > 0;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const tax = this.getTotalTax();
    const discount = this.getDiscountAmount();
    return subtotal + tax - discount;
  }

  getTotalItems(): number {
    return this.cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  order(): void {
    if (this.cart.length > 0) {
      const dataToSend = {
        restaurantId: this.restaurantId,
        tableId: this.tableId,
        items: this.cart,
      };

      this.orderFacade.dispatchPlaceOrder(dataToSend, this.tableId);
    }
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
    this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
  }
}
