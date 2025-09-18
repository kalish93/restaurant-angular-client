import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { insertItem, patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { successStyle } from 'src/app/core/services/operation-status/status-style-names';

import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';

import {
  AddOrderItem,
  AddToCart,
  GetActiveOrders,
  GetActiveTableOrder,
  GetActiveRestaurantOrder,
  GetOrderHistory,
  MarkAsPaid,
  PlaceOrder,
  RemoveOrderItem,
  RequestPayment,
  SaveTipAndDiscount,
  UpdateCart,
  UpdateOrderItem,
  UpdateOrderStatus,
  PlaceOrderByNumber,
  GetOrderByNumber,
} from './order.actions';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/menu.model';

export interface OrderStateModel {
  order: any;
  cart: Cart[];
  myTableOrders: any[];
  activeOrders: any[];
  orderHistory: any[];
}

const ORDER_STATE_TOKEN = new StateToken<OrderStateModel>('orderState');

const defaults = {
  order: {},
  cart: [],
  myTableOrders: [],
  activeOrders: [],
  orderHistory: [],
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

    console.log(currentCart);
    console.log(data);

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
    { order, tableId }: PlaceOrder
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.placeOrder(order).pipe(
      tap((result) => {
        setState(
          patch({
            order: result,
            cart: [],
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Refresh orders based on whether tableId exists
        if (tableId) {
          this.store.dispatch(new GetActiveTableOrder(tableId));
        } else {
          // Get restaurant orders when no table ID
          this.store.dispatch(new GetActiveRestaurantOrder(order.restaurantId));
        }

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

  @Action(GetActiveRestaurantOrder)
  getRestaurantOrder(
    { setState }: StateContext<OrderStateModel>,
    { restaurantId }: GetActiveRestaurantOrder
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.getActiveRestaurantOrder(restaurantId).pipe(
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

  @Action(GetActiveOrders)
  getActiveOrders(
    { setState }: StateContext<OrderStateModel>,
    {}: GetActiveOrders
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.getActiveOrders().pipe(
      tap((result) => {
        setState(
          patch({
            activeOrders: result,
          })
        );

        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(GetOrderHistory)
  getOrderHistory(
    { setState }: StateContext<OrderStateModel>,
    { pageNumber, pageSize }: GetOrderHistory
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.getOrderHistory(pageNumber, pageSize).pipe(
      tap((result) => {
        setState(
          patch({
            orderHistory: result,
          })
        );

        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(UpdateOrderStatus)
  updataOrderStatus(
    { setState, patchState }: StateContext<OrderStateModel>,
    { data }: UpdateOrderStatus
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.upateOrderStatus(data).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        this.store.dispatch(new GetActiveOrders());
        // Display a success message
        this.operationStatus.displayStatus(
          'Status updated successfully!',
          successStyle
        );
      })
    );
  }

  @Action(UpdateOrderItem)
  updateOrderItem(
    { setState, patchState }: StateContext<OrderStateModel>,
    { data, tableId, restaurantId, orderNumber }: UpdateOrderItem
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.updateOrderItem(data).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        if (tableId) {
        this.store.dispatch(new GetActiveTableOrder(tableId));
        }else{
          this.store.dispatch(new GetOrderByNumber(restaurantId, orderNumber));
        }
        // Display a success message
        this.operationStatus.displayStatus(
          'Order updated successfully!',
          successStyle
        );
      })
    );
  }

  @Action(RemoveOrderItem)
  removeOrderItem(
    { setState, patchState }: StateContext<OrderStateModel>,
    { itemId, tableId, restaurantId, orderNumber }: RemoveOrderItem
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.removeOrderItem(itemId).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        if (tableId){
        this.store.dispatch(new GetActiveTableOrder(tableId));
        }else{
          this.store.dispatch(new GetOrderByNumber(restaurantId, orderNumber));
        }
        // Display a success message
        this.operationStatus.displayStatus(
          'Item removed successfully!',
          successStyle
        );
      })
    );
  }

  @Action(AddOrderItem)
  addOrderItem(
    { setState, patchState }: StateContext<OrderStateModel>,
    { data, tableId,restaurantId, orderNumber }: AddOrderItem
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.addOrderItem(data).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        if(tableId){
        this.store.dispatch(new GetActiveTableOrder(tableId));
        }else{
          this.store.dispatch(new GetOrderByNumber(restaurantId, orderNumber));
        }
        // Display a success message
        this.operationStatus.displayStatus(
          'Item removed successfully!',
          successStyle
        );
      })
    );
  }

  @Action(RequestPayment)
  requestPayment(
    { setState, patchState }: StateContext<OrderStateModel>,
    { tableId }: RequestPayment
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.requestPayment(tableId).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        // Display a success message
        this.operationStatus.displayStatus(
          'Payment requested successfully!',
          successStyle
        );
      })
    );
  }

  @Action(MarkAsPaid)
  markAsPaid(
    { setState, patchState }: StateContext<OrderStateModel>,
    { orderIds, tableId, restaurantId, orderNumber }: MarkAsPaid
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.markAsPaid(orderIds).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
        if(tableId){
        this.store.dispatch(new GetActiveTableOrder(tableId));
        }else{
          this.store.dispatch(new GetOrderByNumber(restaurantId, orderNumber));
        }
        // Display a success message
        this.operationStatus.displayStatus(
          'Table Reset successfully!',
          successStyle
        );
      })
    );
  }

  @Action(SaveTipAndDiscount)
  saveDiscountAndTip(
    { setState, patchState }: StateContext<OrderStateModel>,
    { data }: SaveTipAndDiscount
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.saveTipAndDiscount(data).pipe(
      tap((result) => {
        setState(patch({}));

        this.store.dispatch(new SetProgressOff());
      })
    );
  }


  @Action(PlaceOrderByNumber)
  createOrderByNumber(
    { setState, patchState }: StateContext<OrderStateModel>,
    { order }: PlaceOrderByNumber
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.placeOrderByNumber(order).pipe(
      tap((result) => {
        setState(
          patch({
            order: result,
            cart: [],
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Refresh orders based on whether tableId exists
        // if (tableId) {
          this.store.dispatch(new GetOrderByNumber(order.restaurantId, result.number));
        // } else {
        //   // Get restaurant orders when no table ID
        //   this.store.dispatch(new GetActiveRestaurantOrder(order.restaurantId));
        // }

        // Display a success message
        this.operationStatus.displayStatus(
          'Order sent successfully!, your order number is ' + result.number + '',
          successStyle
        );
      })
    );
  }

  @Action(GetOrderByNumber)
  getOrderByNumber(
    { setState }: StateContext<OrderStateModel>,
    { restaurantId, number }: GetOrderByNumber
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.orderService.getOrderByNumber(restaurantId, number).pipe(
      tap((result) => {
        setState(
          patch({
            myTableOrders: [result],
          })
        );
        console.log(result);
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

}
