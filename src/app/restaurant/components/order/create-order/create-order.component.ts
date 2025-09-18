import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';

interface CreateOrderState {
  menu: any[];
  cart: any[]; // holds items before confirming
  tables: any[];
}

const initCreateOrderState: CreateOrderState = {
  menu: [],
  cart: [],
  tables: [],
};

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  providers: [RxState],
})
export class CreateOrderComponent implements OnInit {
  menuItemForm: FormGroup;
  menuItems: any[] = [];
  tableId: string | null = null;

  cart$ = this.state.select('cart');
  menu$ = this.state.select('menu');
  tables$ = this.state.select('tables');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrderComponent>,
    private menuFacade: MenuFacade,
    private orderFacade: OrderFacade,
    private state: RxState<CreateOrderState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.state.set(initCreateOrderState);
    this.state.connect('menu', this.menuFacade.menus$);

    this.menuItemForm = this.fb.group({
      menuItemId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      specialInstructions: [''],
    });
  }

  ngOnInit(): void {
    // Load menus
    this.menuFacade.dispatchGetMenus();
    this.menu$.subscribe((menu) => (this.menuItems = menu));

    // Load tables (if available)
    if (this.data.restaurantId) {
      // Replace with actual facade/service call to fetch tables
      this.state.set('tables', this.data.tables || []);
    }
  }

  /** Add the current form item to the cart */
  addToCart() {
    if (!this.menuItemForm.valid) return;

    const selectedMenuItem = this.menuItems.find(
      (m) => m.id === this.menuItemForm.value.menuItemId
    );
    if (!selectedMenuItem) return;

    const cartItem = {
      menuItemId: this.menuItemForm.value.menuItemId,
      quantity: this.menuItemForm.value.quantity,
      specialInstructions: this.menuItemForm.value.specialInstructions,
      menuItem: selectedMenuItem,
    };

    // Add to cart with RxState updater function
    this.state.set('cart', (state) => [...state.cart, cartItem]);

    // Reset form to add another item
    this.menuItemForm.reset({ quantity: 1, specialInstructions: '' });
  }

  /** Remove an item from the cart */
  removeFromCart(index: number) {
    this.state.set('cart', (state) => {
      const cart = [...state.cart];
      cart.splice(index, 1);
      return cart;
    });
  }

  confirmOrder() {
    const cart = this.state.get('cart');
    if (cart.length === 0) return;

    const dataToSend = {
      restaurantId: this.data.restaurantId,
      items: cart.map((i: any) => ({
        menuItem: i.menuItem,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions,
      })),
    };

    if (this.tableId) {
      this.orderFacade.dispatchPlaceOrder(
        { ...dataToSend, tableId: this.tableId },
        this.tableId
      );
    } else {
      this.orderFacade.dispatchPlaceOrderByNumber(dataToSend);
    }

    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
