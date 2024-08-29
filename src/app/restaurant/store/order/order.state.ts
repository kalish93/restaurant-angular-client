import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import {
  insertItem,
  patch,
} from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { successStyle } from 'src/app/core/services/operation-status/status-style-names';

import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';

import { AddToCart, GetActiveTableOrder, PlaceOrder, UpdateCart } from './order.actions';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/menu.model';

export interface OrderStateModel {
  order: any;
  cart: Cart[];
  myTableOrders: any[]
}

const ORDER_STATE_TOKEN = new StateToken<OrderStateModel>('orderState');

const defaults = {
  order: {},
  cart: [],
  myTableOrders: []
};

@State<OrderStateModel>({
  name: ORDER_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class OrderState {
  constructor(
    private operationStatus: OperationStatusService,
    private store: Store,
    private orderService: OrderService
  ) {}


  @Action(AddToCart)
  addToCart(
    { setState, getState }: StateContext<OrderStateModel>,
    { data }: AddToCart
  ) {
    // this.store.dispatch(new SetProgressOn());

    // Get the current cart from the state
    const currentCart = getState().cart || [];

    // Check if the item already exists in the cart
    const existingCartItem = currentCart.find(
      (item) => item.menuItem.id === data.menuItem.id
    );

    if (existingCartItem) {
      // Update the quantity of the existing item
      existingCartItem.quantity += data.quantity;
    } else {
      // Add the new item to the cart
      currentCart.push(data);
    }

    // Update the state with the new cart
    setState(
      patch({
        cart: [...currentCart],
      })
    );
    // this.store.dispatch(new SetProgressOff());
  }

  @Action(UpdateCart)
  updateCart(
    { setState, getState }: StateContext<OrderStateModel>,
    { cart }: UpdateCart
  ) {
    setState(
      patch({
        cart: cart,
      })
    );
  }

  // @Action(GetMenus)
  // getRestaurants({ setState }: StateContext<OrderStateModel>, {}: GetMenus) {
  //   this.store.dispatch(new SetProgressOn());
  //   return this.menuService.getMenus().pipe(
  //     tap((result) => {
  //       setState(
  //         patch({
  //           menus: result,
  //         })
  //       );
  //       this.store.dispatch(new SetProgressOff());
  //     })
  //   );
  // }

  @Action(PlaceOrder)
  createOrder(
    { setState, patchState }: StateContext<OrderStateModel>,
    { order }: PlaceOrder
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.placeOrder(order).pipe(
      tap((result) => {
        setState(
          patch({
            order: result,
            cart: []
          })
        );

        this.store.dispatch(new SetProgressOff());
        // Display a success message
        this.operationStatus.displayStatus(
          'Order sent successfully!',
          successStyle
        );
      })
    );
  }


  @Action(GetActiveTableOrder)
getTable(
  { setState }: StateContext<OrderStateModel>,
  { tableId }: GetActiveTableOrder
) {
  this.store.dispatch(new SetProgressOn());
  return this.orderService.getActiveTableOrder(tableId).pipe(
    tap((result) => {
      setState(
        patch({
          myTableOrders: result,
        })
      );
      this.store.dispatch(new SetProgressOff());
    })
  );
}


}
