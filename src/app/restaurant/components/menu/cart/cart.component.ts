import { Component, Input, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Cart, Menu } from 'src/app/restaurant/models/menu.model';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { MatDialogRef } from '@angular/material/dialog';

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
  @Input() restaurantId: string | null = null;
  @Input() tableId: string | null = null;
  cart$ = this.state.select('cart');
  cart: Cart[] = [];


  // Discount properties
  discountCode: string = '';
  discountPercent: number = 0;

  constructor(
    private state: RxState<CartComponentState>,
    private menuFacade: MenuFacade,
    private router: Router,
    private route: ActivatedRoute,
    private orderFacade: OrderFacade,
    @Optional() private dialogRef?: MatDialogRef<CartComponent> // <-- injected only when in modal
  ) {
    this.state.set(initCartComponentState);
    this.state.connect('cart', this.orderFacade.cart$);
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   this.restaurantId = params.get('restaurantId');
    //   this.tableId = params.get('tableId');
    // });
     if (!this.restaurantId || !this.tableId) {
      this.route.paramMap.subscribe((params) => {
        this.restaurantId = this.restaurantId || params.get('restaurantId');
        this.tableId = this.tableId || params.get('tableId');
      });
    }
    this.cart$.subscribe((data) => {
      console.log(data);
      this.cart = data || [];
      // Initialize special instructions and show states from existing cart items
      this.cart.forEach((item) => {
        if (item.specialInstructions) {
          this.specialInstructions[item.menuItem.id] = item.specialInstructions;
          this.showInstructionsFor[item.menuItem.id] = true;
        }
      });
    });
  }

  getImageUrl(imagePath: string): string {
    return `${MEDIA_URL}/${imagePath}`;
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      // Update the quantity of the item in the cart
      this.cart[index].quantity = newQuantity;
      // Update the cart in the global state
      this.orderFacade.dispatchUpdateCart(this.cart);
    }
  }

  // Special instructions for each menu item
  specialInstructions: { [menuItemId: string]: string } = {};
  showInstructionsFor: { [menuItemId: string]: boolean } = {};

  toggleSpecialInstructions(itemId: string) {
    this.showInstructionsFor[itemId] = !this.showInstructionsFor[itemId];
    if (!this.showInstructionsFor[itemId]) {
      // When hiding instructions, clear them from both local state and cart item
      this.specialInstructions[itemId] = '';
      this.updateCartItemSpecialInstructions(itemId, '');
    }
  }
  updateSpecialInstructions(itemId: string, instructions: string) {
    this.specialInstructions[itemId] = instructions;
    // Update the cart item with the new special instructions
    this.updateCartItemSpecialInstructions(itemId, instructions);
  }

  updateCartItemSpecialInstructions(itemId: string, instructions: string) {
    // Find the cart item and update its special instructions
    const cartItem = this.cart.find((item) => item.menuItem.id === itemId);
    if (cartItem) {
      cartItem.specialInstructions = instructions.trim() || undefined;
      // Update the cart in the global state
      this.orderFacade.dispatchUpdateCart(this.cart);
    }
  }

  removeFromCart(item: Cart): void {
    // Logic to remove item from cart
    this.cart = this.cart.filter(
      (cartItem) => cartItem.menuItem.id !== item.menuItem.id
    );
    // Clean up special instructions state for removed item
    delete this.specialInstructions[item.menuItem.id];
    delete this.showInstructionsFor[item.menuItem.id];
    this.orderFacade.dispatchUpdateCart(this.cart); // Update the cart in the global state
  }

  getSubtotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  }

  hasDiscount(): boolean {
    return this.discountCode !== '' && this.discountPercent > 0;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    return subtotal;
  }

  getTotalItems(): number {
    return this.cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  order(): void {
    if (this.cart.length > 0) {
      // Ensure all special instructions are properly synced before placing order
      this.cart.forEach((item) => {
        const instructions = this.specialInstructions[item.menuItem.id];
        if (instructions && instructions.trim()) {
          item.specialInstructions = instructions.trim();
        }
      });
    }
      const dataToSend = {
        restaurantId: this.restaurantId,
        // tableId: this.tableId,
        items: this.cart,
      };

    //   this.orderFacade.dispatchPlaceOrder(dataToSend, this.tableId);
    // }

    if (this.dialogRef) {
      this.dialogRef.close();
    }
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
    if (this.tableId) {
       this.orderFacade.dispatchPlaceOrder(
        { ...dataToSend, tableId: this.tableId },
        this.tableId
      );
      this.router.navigate([`/orders/${this.restaurantId}/${this.tableId}`]);
    } else {

      this.orderFacade.dispatchPlaceOrderByNumber(dataToSend);
      this.router.navigate([`/orders/${this.restaurantId}`]);
    }
    // this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
  }
}
